import { Handler } from "../../types/handler";
import * as DirectMessageService from '../directMessage/directMessage.service'

export const createMessage:Handler = async(req,res)=>{
    
    const senderId = req.user?.id;

    if(!senderId){
        return res.status(403).json({
            message:"User not found!"
        })
    }

    const { content } = req.body;
    const convoId = req.params.id;

    const response = await DirectMessageService.createDirectMessage(senderId , content , convoId as string);
    if(!response.success){
        return res.status(500).json({
            message:response.message
        })
    }

    return res.status(201).json({
        message:response.message,
        data:response.data
    })


}

export const getMessages:Handler=async(req,res)=>{

    const convoId = req.params.id;
    if(!convoId){
        return res.status(404).json({
            message:"Conversation not found.."
        })
    }

    const response = await DirectMessageService.getMessages(convoId as string)
    if(!response.success){
        return res.status(500).json({
            message:response.message
        })
    }

    return res.status(200).json({
        message:response.message
    })

}


