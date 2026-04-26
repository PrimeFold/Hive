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
        await redis.lpush(`direct-message:${convoId}`,JSON.stringify(DirectMessage))
        await redis.ltrim(`direct-message:${convoId}`, 0, 49)
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
                data:cached.map((item:string)=>JSON.parse(item)).reverse(),
                statusCode: 200
            }
        }

        const messages = await prisma.directMessage.findMany({
            where:{conversationId:convoId},
            orderBy:{createdAt:'asc'},
            take:50,
            include:{sender:true}
        })

        // Cache messages for future requests
        for (const msg of messages) {
            await redis.lpush(key, JSON.stringify(msg));
        }
        await redis.ltrim(key, 0, 49);  // Keep only last 50
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

export const deleteDirectMessageById = async (messageId: string, userId: string) => {
  try {
    // 1. Find the message to verify it exists and check ownership
    const message = await prisma.directMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return { success: false, statusCode: 404, message: "Direct message not found" };
    }

    // 2. Ensure the user deleting the message is the one who sent it
    if (message.senderId !== userId) {
      return { success: false, statusCode: 403, message: "Unauthorized to delete this message" };
    }

    // 3. Perform the deletion
    await prisma.directMessage.delete({
      where: { id: messageId },
    });
    await redis.del(`direct-message:${message.conversationId}`);

    return { success: true, statusCode: 200, message: "Message deleted successfully" };
  } catch (error) {
    console.error("Error in deleteDirectMessageById service:", error);
    return { success: false, statusCode: 500, message: "Internal Server Error" };
  }
};
