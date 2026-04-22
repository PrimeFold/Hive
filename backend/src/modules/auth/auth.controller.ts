import { Handler } from '../../types/handler';
import * as AuthService from './auth.service';
import { emailSchema, loginSchema, signupSchema, usernameSchema } from '../../validation/zod';


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
    const accessToken = response.accessToken;
    
    if(response.success){
        return res.status(200).json({message:response.message, token:accessToken })

    }else{

        return res.status(401).json({message:response.message})
    }

}

export const updateUsername:Handler = async(req,res)=>{

    const userId = req.user.id;

    const result = usernameSchema.safeParse(req.body);
    if(!result.success){
        return res.status(403).json({message:"Invalid Username , Try again.."})
    }

    const {username} = result.data;

    const response = await AuthService.updateUsername(userId,username);

    if(response.success){
        return res.status(200).json({
            message:response.message,
            user:response.user
        })
    }else{
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }


}

export const updateEmail:Handler = async(req,res)=>{

    const userId = req.user.id;

    const result = emailSchema.safeParse(req.body);
    if(!result.success){
        return res.status(403).json({message:"Invalid Username , Try again.."})
    }

    const {email} = result.data;

    const response = await AuthService.updateUsername(email,userId);

    if(response.success){
        return res.status(200).json({
            message:response.message,
            user:response.user
        })
    }else{
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }

}

export const updatePassword:Handler = async(req,res)=>{

    const userId = req.user.id;

    const {password} = req.body;

    const response = await AuthService.updateUsername(password,userId);

    if(response.success){
        return res.status(200).json({
            message:response.message,
            user:response.user
        })
    }else{
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }

}

export const deleteUser:Handler = async(req,res)=>{

    const userId = req.user.id;
    const response = await AuthService.deleteUser(userId);

    if(response.success){
        return res.status(200).json({
            message:response.message
        })
    }else{
        return res.status(500).json({
            message: response.message
        })
    }



}



