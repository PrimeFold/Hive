import { Secret } from "jsonwebtoken";
import  jwt  from "jsonwebtoken"
import prisma from "../../lib/prisma";
import { AuthServiceResponse, LoginPayload, UserPayload } from "../../types";
import { redis } from "../../utils/redis";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const MAX_ATTEMPTS = 3;
const BLOCK_TIME = 60 * 60;

const fail = async (ip: string):Promise<AuthServiceResponse<LoginPayload>> => {
  const newAttempts = await redis.incr(`failed:${ip}`);

  if (newAttempts === 1) {
    await redis.expire(`failed:${ip}`, BLOCK_TIME);
  }
  return {
    success: false,
    message: "...",
    statusCode: 401
  };
};

export const login = async (
  data: { email: string; password: string },
  ip: string
): Promise<AuthServiceResponse<LoginPayload>> => {
  try {
    const attempts = Number(await redis.get(`failed:${ip}`)) || 0;

    if (attempts >= MAX_ATTEMPTS) {
      return { success: false, message: "Too many attempts. Try later.", statusCode: 429 };
    }

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) return { ...fail(ip), statusCode: 401 };

    const isValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isValid) return { ...fail(ip), statusCode: 401 };

    // FIXED: Use consistent environment variable names
    const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as Secret;
    const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as Secret;

    // DEBUG: Log to check if secrets are actually loaded
    console.log("JWT_ACCESS_SECRET exists:", !!process.env.JWT_ACCESS_SECRET);
    console.log("JWT_REFRESH_SECRET exists:", !!process.env.JWT_REFRESH_SECRET);
    console.log("JWT_ACCESS_SECRET length:", process.env.JWT_ACCESS_SECRET?.length || 0);

    // Validate secrets exist before signing
    if (!ACCESS_SECRET || !REFRESH_SECRET) {
      console.error("JWT secrets are missing from environment variables!");
      return { 
        success: false, 
        message: "Server configuration error", 
        statusCode: 500 
      };
    }

    const accessToken = jwt.sign(
      { id: user.id },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Tokens signed successfully");

    const hashedRFT = await bcrypt.hash(refreshToken, 10);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashedRFT,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await redis.del(`failed:${ip}`);

    const userPayload: UserPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName ?? "",
      bio: user.bio ?? "",
    };

    return {
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        refreshToken,
        user: userPayload,
      },
      statusCode: 200
    };
  } catch(error) {
    console.error("Login error details:", error);
    return { success: false, message: (error as Error).message, statusCode: 500 };
  }
};

export const signup = async (data: {
  username: string;
  email: string;
  displayName: string;
  password: string;
}): Promise<AuthServiceResponse<UserPayload>> => {
  try {
    const exists = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (exists) {
      return { success: false, message: "User already exists", statusCode: 400 };
    }

    const hashPass = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        displayName: data.displayName,
        passwordHash: hashPass,
      },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        bio: true,
      },
    });

    return {
      success: true,
      message: "User created successfully",
      data: {
        ...user,
        displayName: user.displayName ?? "",
        bio: user.bio ?? "",
      },
      statusCode: 201
    };
  } catch (error) {
    return { success: false, message: (error as Error).message, statusCode: 500 };
  }
};


