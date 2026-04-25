import { Handler } from '../../types/handler';
import * as AuthService from './auth.service';
import { loginSchema, signupSchema } from '../../validation/zod';
import bcrypt from 'bcrypt'
import  jwt, { Secret }  from 'jsonwebtoken';

export const signup:Handler = async(req,res)=>{
   
    const result = signupSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({message:"Invalid credentials"})
    }
    
    const response = await AuthService.signup(result.data);

    const statusCode = response.statusCode || 500;
    if(!response.success){
        return res.status(statusCode).json({message: response.message})
    }

    return res.status(statusCode).json({message: response.message})
}

export const login:Handler = async(req,res)=>{

    const result = loginSchema.safeParse(req.body);
    const ip = req.ip ?? 'unknown';
    if(!result.success){
        return res.status(400).json({message:"Invalid Credentials"})
    }

    const {email,password} = result.data

    const data = {email,password};
    const response = await AuthService.login(data,ip);
    
    
    const statusCode = response.statusCode || 500;
    if(response.success){
        const accessToken = response.data.accessToken;

        res.cookie('refresh-token',response.data.refreshToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV ==='production',
            sameSite:'strict',
            maxAge:7 * 24 * 60 * 60 * 1000,
        })

        return res.status(statusCode).json({message:response.message, token:accessToken })

    }else{

        return res.status(statusCode).json({message:response.message})
    }

}

export const generateRefreshToken:Handler = async(req,res)=>{
    const userId = req.user?.id;

    if(!userId){
        return res.status(403).json({
            message:"Forbidden.."
        })
    }

    const CookieToken = req.cookies['refresh-token'] as string | undefined;
    const response = await AuthService.getRefreshTokenFromDB(userId);
    if(!response.success){
        const statusCode = response.statusCode || 500;
        return res.status(statusCode).json({
            message:response.message
        })
    }

    const DBToken = response.data?.tokenHash
    if(!CookieToken || !DBToken){
        return res.status(403).json({
            message:"Forbidden.."
        })
    }

    const isValid = await bcrypt.compare(CookieToken, DBToken)
    if(!isValid){
        return res.status(401).json({
            message:"Unauthorized.."
        })
    }

    const newAccessToken = jwt.sign(
        {id:userId},
        process.env.JWT_ACCESS_SECRET as Secret,
        {expiresIn:'15m'}
    )

    const newRefreshToken = jwt.sign(
        {id:userId},
        process.env.JWT_REFRESH_SECRET as Secret,
        {expiresIn:'7d'}
    )


    const deleted = await AuthService.deleteOldTokenFromDB(userId);
    if(!deleted.success){
        return res.status(500).json({
            message:deleted.message
        })
    }

    const stored = await AuthService.storeNewTokenInDB(newRefreshToken,userId)
    if(!stored.success){
        return res.status(500).json({
            message:stored.message
        })
    }
    return res.status(200).json({message:stored.message,accessToken:newAccessToken})
}




