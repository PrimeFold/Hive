import prisma from "../../../lib/prisma"
import { redis } from "../../../utils/redis"

export const getMessagesByChannelID = async(channelId:string)=>{
    try {

        const key = `channel-message:${channelId}`
        const cached = await redis.lrange(key,0,-1);

        if(cached && cached.length>0){
            console.log("CACHE HIT")
            return {
                success:true,
                message:"Fetched from cache",
                data:cached.map((item:string)=>JSON.parse(item))
            }
        }



        const messages = await prisma.message.findMany({
            where:{channelId:channelId}
        })

        if(!messages){
            return {
                success:false,
                message:"No messages found !"
            }
        }

        console.log("CACHE MISS , HIT DB")

        // Cache messages for future requests
        for (const msg of messages) {
            await redis.lpush(`channel-message:${channelId}`, JSON.stringify(msg));
        }
        await redis.ltrim(`channel-message:${channelId}`, 0, 49);  // Keep only last 50
        await redis.expire(`channel-message:${channelId}`, 15*60);

        return {
            success:true,
            message:"Fetched messages",
            data:messages
        }

    } catch (error) {
        return {
            success:false,
            message:"Internal Server Error"
        }
    }
    
}

export const createMessage=async(userId:string,content:string,channelId:string)=>{

    try {
        const newMessage = await prisma.message.create({
            data:{
                channelId:channelId,
                userId:userId,
                content:content
            },
            include:{user:true}
        })

        await redis.lpush(`channel-message:${channelId}`,JSON.stringify(newMessage))
        await redis.ltrim(`channel-message:${channelId}`,0,49)
        await redis.expire(`channel-message:${channelId}`,15*60)

        return {
            success:true,
            message:"Message created",
            data:newMessage
        }


    } catch (error) {
        return{
            success:false,
            message:"Error sending message",
        }
    }


}



