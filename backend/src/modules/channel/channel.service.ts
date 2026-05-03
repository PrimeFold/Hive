import prisma from "../../lib/prisma"

export const createChannel = async(channelName:string,workspaceId:string)=>{

    try {
        
        const channel = await prisma.channel.create({
            data:{
                name:channelName,
                workspaceId:workspaceId,
                createdAt: new Date(Date.now())
            }
        })

        return {
            success:true,
            message:"Channel created successfully!",
            data:channel,
            statusCode:201
        }

    } catch (error) {
        return {
            success:false,
            message:"Error creating channel..",
            statusCode:500
        }
    }

}


export const getAllChannels = async(workspaceId:string)=>{
    try {
        const channels = await prisma.channel.findMany({
            where:{workspaceId:workspaceId}
        })

        if(!channels || channels.length === 0){
            return{
                success:true,
                message:"No channels found",
                statusCode:200,
                data:[]
            }
        }

        return{
            success:true,
            message:"channels found !",
            data:channels,
            statusCode:200
        }
    } catch (error) {
        return{
            success:false,
            message:"Internal Server Error",
            statusCode:500
        }
    }
}

export const editChannelName = async(newName:string,channelId:string)=>{
    try {
        const renamedChannel = await prisma.channel.update({
            where:{id:channelId},
            data:{name:newName}
        })

        return {
            success:true,
            message:"Channel name updated successfully!",
            data:renamedChannel,
            statusCode:200
        }

    } catch (error) {
        return {
            success:false,
            message:"Error updating channel name",
            statusCode:500
        }
    }

}

export const deleteChannel = async(channelId:string)=>{
    try {
        await prisma.channel.delete({
            where:{id:channelId}
        })

        return {
            success:true,
            message:"Channel deleted successfully!",
            statusCode:200
        }

    } catch (error) {
        return {
            success:false,
            message:"Error deleting channel",
            statusCode:500
        }
    }

}

export const getChannelById = async(wid:string,cid:string)=>{

    try {
        
        const channel = await prisma.channel.findFirst({
            where:{workspaceId:wid,id:cid},
            select:{
                id: true,
                name: true,
                createdAt: true,
                workspaceId: true,
            }
        })

        return {
            success:true,
            message:"Channel fetched successfully!",
            statusCode:200,
            data:channel
        }

    } catch (error) {
        return {
            success:false,
            message:"Error fetching channel",
            statusCode:500
        }
    }

}

