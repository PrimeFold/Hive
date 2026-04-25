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


