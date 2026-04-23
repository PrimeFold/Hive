import { Request } from "express";

export interface AuthUser{
    id:string;
}

export interface AuthRequest extends Request{
    user:AuthUser;
}

export type UserServiceResponse<T>=
  | {
      success:true,
      message:string,
      data:T
    }
  | {
      success:false,
      message:string
    }


type NoDataReturnPayload = {
  success:boolean,
  message:string
}


type LoginPayload={
  accessToken:string
  refreshToken:string
}

type SignupPayload = {
  username: string,
  email: string,
  displayName: string,

}

type UserPayload = {
  
    id: string;
    email: string;
    username: string;
    displayName: string;
    bio: string | null;
  
  
};


export type AuthServiceResponse<T> =
  | {
      success: true;
      message: string;
      data: T;
    }
  | {
      success: false;
      message: string;
    };





