import { Request } from "express";

export interface AuthUser{
    id:string;
}

export interface AuthRequest extends Request{
    user:AuthUser;
}


