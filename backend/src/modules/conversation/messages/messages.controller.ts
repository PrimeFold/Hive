import { Handler } from "../../../types/handler";
import * as MessageService from '../messages/messages.service'

export const getMessagesByID : Handler= async(req,res)=>{

    const channelId = req.params.id;
    const response = await MessageService.getMessagesByID(channelId as string);
    if (!response.success) {
        return res.status(400).json({ message: response.message });
    }
    
    return res.status(200).json({ message: response.message, data: response.data });
}

export const createMessage:Handler = async(req,res)=>{
    const channelId = req.params.id;
    const userId = req.user?.id;
    const content = req.body;
    const response = await MessageService.createMessage(channelId as string,userId  as string,content);
    if (!response.success) {
        return res.status(400).json({ message: response.message });
    }
    
    return res.status(200).json({ message: response.message, data: response.data });

}



