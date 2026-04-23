import prisma from "../../lib/prisma";
import bcrypt from "bcrypt";
import { redis } from "../../utils/redis";
import jwt, { Secret } from "jsonwebtoken";
import { AuthServiceResponse, UserPayload } from "../../types";
import { LoginPayload } from "../../types";

const MAX_ATTEMPTS = 3;
const BLOCK_TIME = 60 * 60;

// -------------------- HELPERS --------------------

const fail = async (ip: string):Promise<AuthServiceResponse<LoginPayload>> => {
  const newAttempts = await redis.incr(`failed:${ip}`);

  if (newAttempts === 1) {
    await redis.expire(`failed:${ip}`, BLOCK_TIME);
  }
  return {
    success: false,
    message: "...",
  };
};

// -------------------- SIGNUP --------------------

export const signup = async (data: {
  username: string;
  email: string;
  displayName: string;
  password: string;
}): Promise<AuthServiceResponse<UserPayload>>=> {
  try {
    const exists = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (exists) {
      return { success: false, message: "User already exists" };
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
    };
  } catch {
    return { success: false, message: "Signup failed" };
  }
};

// -------------------- LOGIN --------------------

export const login = async (
  data: { email: string; password: string },
  ip: string
): Promise<
  AuthServiceResponse<LoginPayload>> => {
  try {
    const attempts = Number(await redis.get(`failed:${ip}`)) || 0;

    if (attempts >= MAX_ATTEMPTS) {
      return { success: false, message: "Too many attempts. Try later." };
    }

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) return fail(ip);

    const isValid = await bcrypt.compare(
      data.password,
      user.passwordHash
    );

    if (!isValid) return fail(ip);

    const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as Secret;
    const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as Secret;

    const accessToken = jwt.sign(
      { userId: user.id },
      ACCESS_SECRET,
      { expiresIn: "15m", issuer: "Hive" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      REFRESH_SECRET,
      { expiresIn: "7d", issuer: "Hive" }
    );

    const hashedRFT = await bcrypt.hash(refreshToken,10);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashedRFT,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await redis.del(`failed:${ip}`);

    return {
      success: true,
      message: "Login successful",
      data: { accessToken, refreshToken },
    };
  } catch {
    return { success: false, message: "Login failed" };
  }
};

