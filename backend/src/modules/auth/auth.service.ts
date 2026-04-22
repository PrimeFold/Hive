import prisma from "../../lib/prisma";
import bcrypt from "bcrypt";
import { redis } from "../../utils/redis";
import jwt, { Secret } from "jsonwebtoken";

type ServiceResponse<T = undefined> =
  | { success: true; message: string; data: T }
  | { success: false; message: string };

const MAX_ATTEMPTS = 3;
const BLOCK_TIME = 60 * 60;

// -------------------- HELPERS --------------------

const fail = async (ip: string): Promise<ServiceResponse> => {
  const newAttempts = await redis.incr(`failed:${ip}`);

  if (newAttempts === 1) {
    await redis.expire(`failed:${ip}`, BLOCK_TIME);
  }

  return {
    success: false,
    message: "Too many failed attempts / invalid credentials",
  };
};

// -------------------- SIGNUP --------------------

export const signup = async (data: {
  username: string;
  email: string;
  displayName: string;
  password: string;
}): Promise<ServiceResponse> => {
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
      data: user,
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
  ServiceResponse<{ accessToken: string; refreshToken: string }>
> => {
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

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
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

// -------------------- UPDATE USERNAME --------------------

export const updateUsername = async (
  username: string,
  userId: string
): Promise<ServiceResponse> => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { username },
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
      message: "Username updated successfully",
      data: user,
    };
  } catch {
    return { success: false, message: "Internal Server Error" };
  }
};

// -------------------- UPDATE EMAIL --------------------

export const updateEmail = async (
  email: string,
  userId: string
): Promise<ServiceResponse> => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { email },
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
      message: "Email updated successfully",
      data: user,
    };
  } catch {
    return { success: false, message: "Internal Server Error" };
  }
};

// -------------------- UPDATE PASSWORD --------------------

export const updatePassword = async (
  password: string,
  userId: string
): Promise<ServiceResponse> => {
  try {
    const hash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hash },
    });

    return {
      success: true,
      message: "Password updated successfully",
      data: undefined,
    };
  } catch {
    return { success: false, message: "Internal Server Error" };
  }
};

// -------------------- DELETE USER --------------------

export const deleteUser = async (
  userId: string
): Promise<ServiceResponse> => {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    return {
      success: true,
      message: "User deleted successfully",
      data: undefined,
    };
  } catch {
    return { success: false, message: "Internal Server Error" };
  }
};