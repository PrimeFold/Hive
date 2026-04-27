import { Handler } from "../../types/handler";
import { usernameSchema, emailSchema } from "../../validation/zod";
import * as UserService from '../user/user.service'



export const updateUsername:Handler = async(req,res)=>{

    const userId = req.user?.id;
    if(!userId){
        return res.status(403).json({message:"No user found.."})
    }

    const result = usernameSchema.safeParse(req.body);
    if(!result.success){
        return res.status(403).json({message:"Invalid Username , Try again.."})
    }

    const {username} = result.data;

    const response = await UserService.updateUsername(userId,username);

    const statusCode = response.statusCode || 500;
    if(response.success){
        return res.status(statusCode).json({
            message:response.message
        })
    }else{
        return res.status(statusCode).json({
            message:response.message
        })
    }


}

export const updateEmail:Handler = async(req,res)=>{

    const userId = req.user?.id;
    if(!userId){
        return res.status(403).json({message:"No user found.."})
    }

    const result = emailSchema.safeParse(req.body);
    if(!result.success){
        return res.status(403).json({message:"Invalid Username , Try again.."})
    }

    const {email} = result.data;

    const response = await UserService.updateEmail(email,userId);

    const statusCode = response.statusCode || 500;
    if(response.success){
        return res.status(statusCode).json({
            message:response.message
        })
    }else{
        return res.status(statusCode).json({
            message:response.message
        })
    }

}

export const updatePassword:Handler = async(req,res)=>{

    const userId = req.user?.id;

    if(!userId){
        return res.status(403).json({message:"No user found.."})
    }

    const {password} = req.body;

    const response = await UserService.updatePassword(password,userId);

    const statusCode = response.statusCode || 500;
    if(response.success){
        return res.status(statusCode).json({
            message:response.message
        })
    }else{
        return res.status(statusCode).json({
            message:response.message
        })
    }

}

export const deleteUser:Handler = async(req,res)=>{
    
    const userId = req.user?.id;
    if(!userId){
        return res.status(403).json({message:"No user found.."})
    }
    
    
    const response = await UserService.deleteUser(userId);

    const statusCode = response.statusCode || 500;
    if(response.success){
        return res.status(statusCode).json({
            message:response.message
        })
    }else{
        return res.status(statusCode).json({
            message: response.message
        })
    }

}

export const getUser:Handler = async(req,res)=>{
    const userId = req.user?.id;
    if(!userId){
        return res.status(403).json({message:"No user found.."})
    }
    const response = await UserService.getUser(userId);
    
    const statusCode = response.statusCode || 500;
    if(!response.success){
        return res.status(statusCode).json({
            message:response.message
        })
    }

    return res.status(statusCode).json({
        message:response.message,
        user:response.data
    })
}



