import prisma from "../../lib/prisma"
import { redis } from "../../utils/redis"




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
        await redis.lpush(`message:${convoId}`,JSON.stringify(DirectMessage))
        await redis.ltrim(`message:${convoId}`, 0, 49)
        await redis.expire(`message:${convoId}`, 10*60) 

        return {
            success:true,
            message:"Message sent..",
            data:DirectMessage
        }
        
    } catch (error) {
        return {
            success:false,
            message:"Internal Server Error"
        }
    }

}

export const getMessages = async(convoId:string)=>{
    try {
        const messages = await prisma.directMessage.findMany({
            where:{id:convoId}
        })

        if(!messages){
            return{
                success:false,
                message:"No Messages found!",
                data:messages
            }
        }

        return{
            succes:true,
            message:"Messages fetched..",
            data:messages
        }

    } catch (error) {
        return{
            success:false,
            message:"Internal Server Error.."
        }
    }
    

}






