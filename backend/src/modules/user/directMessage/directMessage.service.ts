import prisma from "../../../lib/prisma"
import { redis } from "../../../utils/redis"




export const createDirectMessage = async(senderId:string,content:string,convoId:string)=>{
    try {
        

        const DirectMessage = await prisma.directMessage.create({
            data:{
                senderId:senderId,
                content:content,
                conversationId:convoId
            },
            include:{sender:true}
        })
        await redis.lpush(`direct-message:${convoId}`,JSON.stringify(DirectMessage))
        await redis.ltrim(`direct-message:${convoId}`, 0, 39)
        await redis.expire(`direct-message:${convoId}`, 10*60) 

        return {
            success:true,
            message:"Message sent..",
            data:DirectMessage,
            statusCode: 201
        }
        
    } catch (error) {
        return {
            success:false,
            message:"Internal Server Error",
            statusCode: 500
        }
    }

}

export const getMessages = async(convoId:string)=>{
    try {
        const key = `direct-message:${convoId}`
        const cached = await redis.lrange(key, 0, -1);

        if(cached && cached.length > 0){
            return{
                success:true,
                message:"Messages fetched from cache",
                data:cached.map((item:string)=>JSON.parse(item)),
                statusCode: 200
            }
        }

        const messages = await prisma.directMessage.findMany({
            where:{conversationId:convoId}
        })

        // Cache messages for future requests
        for (const msg of messages) {
            await redis.lpush(key, JSON.stringify(msg));
        }
        await redis.ltrim(key, 0, 39);  // Keep only last 40
        await redis.expire(key, 10*60);

        return{
            success:true,
            message:"Messages fetched from database",
            data:messages,
            statusCode: 200
        }

    } catch (error) {
        return{
            success:false,
            message:"Internal Server Error..",
            statusCode: 500
        }
    }
    

}






