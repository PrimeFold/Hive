import { NextFunction, Response } from "express";
import { Request } from "express";

export type Handler = (req:Request,res:Response,next:NextFunction)=>Promise<any> | any;

