import { NextFunction, Response } from "express";
import { AuthRequest } from "./index";

export type Handler = (req:AuthRequest,res:Response,next:NextFunction)=>Promise<any> | any;

