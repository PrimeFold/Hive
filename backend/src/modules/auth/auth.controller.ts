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

    return res.status(statusCode).json({message: response.message, user: response.data})
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
    if(response.success && response.data){
        const { accessToken, refreshToken, user } = response.data;
        const sameSite: 'none' | 'strict' = process.env.NODE_ENV === 'production' ? 'none' : 'strict';

        res.cookie('refresh-token', refreshToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV ==='production',
            sameSite,
            maxAge:7 * 24 * 60 * 60 * 1000,
        })

        return res.status(statusCode).json({ message: response.message, accessToken, user });

    }else{

        return res.status(statusCode).json({message:response.message})
    }

}

export const generateRefreshToken:Handler = async(req,res)=>{

    const CookieToken = req.cookies['refresh-token'] as string | undefined;
    if(!CookieToken){
      return res.status(403).json({
          message:"Forbidden.."
      })
    }
    

    let decoded: { userId?: string; id?: string };
    try {
      decoded = jwt.verify(CookieToken, process.env.JWT_REFRESH_SECRET as Secret) as { userId?: string; id?: string };
    } catch {
      return res.status(401).json({
          message:"Unauthorized.."
      })
    }

    const userId = decoded.userId || decoded.id;
    if(!userId){
      return res.status(403).json({
          message:"Forbidden.."
      })
    }

    const userResponseData = await AuthService.getUser(userId);
    if(!userResponseData.success){
        const statusCode = userResponseData.statusCode || 500;
        return res.status(statusCode).json({
            message:userResponseData.message
        })
    }


    const response = await AuthService.getRefreshTokenFromDB(userId);
    if(!response.success){
        const statusCode = response.statusCode || 500;
        return res.status(statusCode).json({
            message:response.message
        })
    }

    const tokenRows = response.data || [];
    console.log('token rows found:', tokenRows.length);
    let matchedTokenId: string | null = null;
    for (const tokenRow of tokenRows) {
      const isValid = await bcrypt.compare(CookieToken, tokenRow.tokenHash);
      console.log('isValid:', isValid);
      if (isValid) {
        matchedTokenId = tokenRow.id;
        break;
      }
    }
    if(!matchedTokenId){
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


    const deleted = await AuthService.deleteOldTokenFromDB(matchedTokenId);
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
    const sameSite: 'none' | 'strict' = process.env.NODE_ENV === 'production' ? 'none' : 'strict';
    res.cookie('refresh-token',newRefreshToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV ==='production',
        sameSite,
        maxAge:7 * 24 * 60 * 60 * 1000,
    })
    return res.status(200).json({message:stored.message,accessToken:newAccessToken,user:userResponseData.data})
}
