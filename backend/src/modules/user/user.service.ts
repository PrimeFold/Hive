import { User } from "../../generated/prisma/browser";
import prisma from "../../lib/prisma";
import { NoDataReturnPayload, usernamePayload, UserPayload, UserServiceResponse } from "../../types";
import bcrypt from 'bcrypt';


export const updateUsername = async (
  username: string,
  userId: string
): Promise<UserServiceResponse<usernamePayload>> => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { username },
      select:{
        username: true,
        
      },
    });

    return {
      success: true,
      message: "Username updated successfully",
      data:{
        username:user.username
      },
      statusCode: 200
    };
  } catch {
    return { success: false, message: "Internal Server Error", statusCode: 500 };
  }
};



export const updateEmail = async (
  email: string,
  userId: string
): Promise<UserServiceResponse<UserPayload>> => {
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
      data: {
        ...user,
        displayName:user.displayName ?? "",
        bio:user.bio ?? ""
      },
      statusCode: 200
    };
  } catch {
    return { success: false, message: "Internal Server Error", statusCode: 500 };
  }
};


export const updatePassword = async (
  password: string,
  userId: string
): Promise<NoDataReturnPayload> => {
  try {
    const hash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hash },
    });

    return {
      success: true,
      message: "Password updated successfully",
      statusCode: 200
    };
  } catch {
    return { success: false, message: "Internal Server Error", statusCode: 500 };
  }
};



export const deleteUser = async (
  userId: string
): Promise<NoDataReturnPayload> => {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    return {
      success: true,
      message: "User deleted successfully",
      statusCode: 200
    };
  } catch {
    return { success: false, message: "Internal Server Error", statusCode: 500 };
  }
};

export const getUser = async(userId:string):Promise<UserServiceResponse<UserPayload>> =>{

  try {
    const user = await prisma.user.findUnique({
      where:{id:userId},
      select:{
        id:true,
        username:true,
        email:true,
        displayName:true,
        bio:true
      }
    })

    if (!user) {
      return {
        success: false,
        message: "User not found",
        statusCode: 404
      };
    }

    return {
      success:true,
      message:"Fetched user details",
      data:{
        ...user,
        displayName:user.displayName ?? "",
        bio:user.bio ?? ""
      },
      statusCode: 200
    }

  } catch (error) {
    return {
      success:false,
      message:"Internal Server Error",
      statusCode: 500
    }
  }

}

