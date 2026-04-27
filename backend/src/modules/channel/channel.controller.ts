import { Handler } from "../../types/handler";
import { channelSchema } from "../../validation/zod";
import * as ChannelService from '../channel/channel.service'

export const createChannel : Handler = async(req,res)=>{
    
    const result = channelSchema.safeParse(req.body);
    if(!result.success){
        return res.status(403).json({
            message:"Invalid channel name"
        })
    }
    const {name} = result.data;
    const workspaceId = req.params.id;

    const response = await ChannelService.createChannel(name,workspaceId as string);

    const statusCode = response.statusCode || 500;
    if (!response.success) {
        return res.status(statusCode).json({ message: response.message });
    }
    
    return res.status(statusCode).json({ message: response.message, data: response.data });


}

export const getAllChannels:Handler = async(req,res)=>{

    const workspaceId = req.params.id;

    const response = await ChannelService.getAllChannels(workspaceId as string);
    
    const statusCode = response.statusCode || 500;
    if (!response.success) {
        return res.status(statusCode).json({ message: response.message });
    }

    return res.status(statusCode).json({ message: response.message, data: response.data });

}

export const updateChannelName:Handler = async(req,res)=>{
    
    const result = channelSchema.safeParse(req.body);
    if(!result.success){
        return res.status(403).json({
            message:"Invalid channel name"
        })
    }
    const {name} = result.data;
    const channelId = req.params.id;

    const response = await ChannelService.editChannelName(name,channelId as string);

    const statusCode = response.statusCode || 500;
    if (!response.success) {
        return res.status(statusCode).json({ message: response.message });
    }
    
    return res.status(statusCode).json({ message: response.message, data: response.data });


}

export const deleteChannel:Handler = async(req,res)=>{
    
    const channelId = req.params.id;

    const response = await ChannelService.deleteChannel(channelId as string);

    const statusCode = response.statusCode || 500;
    if (!response.success) {
        return res.status(statusCode).json({ message: response.message });
    }
    
    return res.status(statusCode).json({ message: response.message });


}


