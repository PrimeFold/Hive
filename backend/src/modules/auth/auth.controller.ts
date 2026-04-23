import { Handler } from '../../types/handler';
import * as AuthService from './auth.service';
import { loginSchema, signupSchema } from '../../validation/zod';


export const signup:Handler = async(req,res)=>{
   
    const result = signupSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({message:"Invalid credentials"})
    }
    
    const response = await AuthService.signup(result.data);

    if(!response.success){
        return res.status(400).json({message: response.message})
    }

    return res.status(201).json({message: response.message})
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
    
    
    if(response.success){
        const accessToken = response.data.accessToken;
        return res.status(200).json({message:response.message, token:accessToken })

    }else{

        return res.status(401).json({message:response.message})
    }

}




