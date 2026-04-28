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

// -------------------- REFRESH TOKEN FUNCTIONS --------------------
export const getRefreshTokenFromDB = async (userId: string) => {
  try {
    const tokens = await prisma.refreshToken.findMany({
      where: { userId },
      select: {
        id: true,
        tokenHash: true
      }
    });

    if (!tokens || tokens.length === 0) {
      return {
        success: false,
        message: "Token not found..",
        statusCode: 404
      };
    }

    return {
      success: true,
      message: "Found rf token",
      data: tokens,
      statusCode: 200
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal Server Error",
      statusCode: 500
    };
  }
};

export const deleteOldTokenFromDB = async (tokenId: string) => {
  try {
    await prisma.refreshToken.delete({
      where: { id: tokenId }
    });

    return {
      success: true,
      message: "Refresh token deleted..",
      statusCode: 200
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal Server Error",
      statusCode: 500
    };
  }
};

export const storeNewTokenInDB = async (newRefreshToken: string, userId: string) => {
  const id = userId;
  try {
    const hashedRFT = await bcrypt.hash(newRefreshToken, 10);
    await prisma.refreshToken.create({
      data: {
        userId: id,
        tokenHash: hashedRFT,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    return {
      success: true,
      message: "Stored the refresh token in DB",
      statusCode: 200
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal Server Error",
      statusCode: 500
    };
  }
};

// -------------------- GET USER --------------------
export const getUser = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        bio: true,
      }
    });

    if (!user) {
      return { success: false, message: "User not found", statusCode: 404 };
    }

    const userPayload: UserPayload = {
      ...user,
      displayName: user.displayName ?? "",
      bio: user.bio ?? "",
    };
    
    return {
      success: true,
      message: "Fetched User",
      statusCode: 200,
      data: userPayload
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal Server Error",
      statusCode: 500
    };
  }
};

// -------------------- ADD THESE MISSING FUNCTIONS --------------------

export const refreshToken = async (refreshToken: string): Promise<AuthServiceResponse<{ accessToken: string }>> => {
  try {
    const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as Secret;
    
    if (!REFRESH_SECRET) {
      return { success: false, message: "Server configuration error", statusCode: 500 };
    }

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { id: string };
    
    if (!decoded || !decoded.id) {
      return { success: false, message: "Invalid refresh token", statusCode: 403 };
    }

    // Check if refresh token exists in DB
    const refreshTokens = await prisma.refreshToken.findMany({
      where: { userId: decoded.id }
    });

    let isValid = false;
    for (const token of refreshTokens) {
      if (await bcrypt.compare(refreshToken, token.tokenHash)) {
        isValid = true;
        break;
      }
    }

    if (!isValid) {
      return { success: false, message: "Invalid refresh token", statusCode: 403 };
    }

    // Generate new access token
    const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as Secret;
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    return {
      success: true,
      message: "Token refreshed successfully",
      data: { accessToken: newAccessToken },
      statusCode: 200
    };
  } catch (error) {
    console.error("Refresh token error:", error);
    return { success: false, message: "Invalid or expired refresh token", statusCode: 403 };
  }
};

// Logout function
export const logout = async (userId: string, refreshToken: string) => {
  try {
    // Find and delete the specific refresh token
    const refreshTokens = await prisma.refreshToken.findMany({
      where: { userId }
    });

    for (const token of refreshTokens) {
      if (await bcrypt.compare(refreshToken, token.tokenHash)) {
        await prisma.refreshToken.delete({
          where: { id: token.id }
        });
        break;
      }
    }

    return {
      success: true,
      message: "Logged out successfully",
      statusCode: 200
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal Server Error",
      statusCode: 500
    };
  }
};


