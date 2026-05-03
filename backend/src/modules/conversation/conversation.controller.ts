import { Handler } from "../../types/handler";
import * as ConversationService from '../conversation/conversation.service'



export const createConversation:Handler = async(req,res)=>{
    const currentUser = req.user?.id;
    const targetUser = req.params.id; 

    if(!currentUser){
        return res.status(403).json({
            message:"User not found"
        })
    }

    if (!targetUser) {
        return res.status(400).json({
            message: "Target user is required"
        })
    }

    const response = await ConversationService.createConversation(currentUser, targetUser as string);
    const statusCode = response.statusCode || 500;
    if(!response.success){
        return res.status(statusCode).json({
            message:response.message
        })
    }

    return res.status(statusCode).json({
        message:response.message,
        data:response.data
    })

}


export const deleteConversation:Handler = async(req,res)=>{
   
    const convoId = req.params.id;
    if(!convoId){
        return res.status(404).json({
            message:"Couldn't find a conversation to delete"
        })
    }

    const response = await ConversationService.deleteConversation(convoId as string);
    const statusCode = response.statusCode || 500;
    if(!response.success){
        return res.status(statusCode).json({
            message:response.message
        })
    }

    return res.status(statusCode).json({
        message:response.message
    })

}

export const getAllConversations:Handler = async(req,res)=>{
    const userId = req.user?.id

    if(!userId){
        return res.status(403).json({
            message:"User not found"
        })
    }

    const response = await ConversationService.getAllConversations(userId);
    const statusCode = response.statusCode || 500;
    if(!response.success){
        return res.status(statusCode).json({
            message:response.message
        })
    }

    return res.status(statusCode).json({
        message:response.message,
        data:response.data
    })
}

export const getConversationByID : Handler = async(req,res)=>{
    const convoId = req.params.id;
    const response = await ConversationService.getConversationByID(convoId as string);

    const statusCode = response.statusCode || 500;
    if(!response.success){
        return res.status(statusCode).json({
            message:response.message
        })
    }
    
    return res.status(statusCode).json({
        message:response.message
    })

}

