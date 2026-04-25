import { Handler } from "../../../types/handler";
import * as MessageService from './channelMessage.service'

export const getMessagesByChannelID : Handler= async(req,res)=>{

    const channelId = req.params.id;
    const response = await MessageService.getMessagesByChannelID(channelId as string);
    const statusCode = response.statusCode || 500;
    if (!response.success) {
        return res.status(statusCode).json({ message: response.message });
    }
    
    return res.status(statusCode).json({ message: response.message, data: response.data });
}

export const createMessage:Handler = async(req,res)=>{
    const channelId = req.params.id;
    const userId = req.user?.id;
    const content = req.body;
    const response = await MessageService.createMessage(channelId as string,userId  as string,content);
    const statusCode = response.statusCode || 500;
    if (!response.success) {
        return res.status(statusCode).json({ message: response.message });
    }
    
    return res.status(statusCode).json({ message: response.message, data: response.data });

}



