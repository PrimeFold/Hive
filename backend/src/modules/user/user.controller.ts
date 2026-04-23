import { Handler } from "../../types/handler";
import { usernameSchema, emailSchema } from "../../validation/zod";
import * as AuthService from '../user/user.service'



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

    const response = await AuthService.updateUsername(userId,username);

    if(response.success){
        return res.status(200).json({
            message:response.message,
            user:response.data
        })
    }else{
        return res.status(500).json({
            message:"Internal Server Error"
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

    const response = await AuthService.updateEmail(email,userId);

    if(response.success){
        return res.status(200).json({
            message:response.message,
            user:response.data
        })
    }else{
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }

}

export const updatePassword:Handler = async(req,res)=>{

    const userId = req.user?.id;

    if(!userId){
        return res.status(403).json({message:"No user found.."})
    }

    const {password} = req.body;

    const response = await AuthService.updateUsername(password,userId);

    if(response.success){
        return res.status(200).json({
            message:response.message,
            user:response.data
        })
    }else{
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }

}

export const deleteUser:Handler = async(req,res)=>{
    
    const userId = req.user?.id;
    if(!userId){
        return res.status(403).json({message:"No user found.."})
    }
    
    
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


