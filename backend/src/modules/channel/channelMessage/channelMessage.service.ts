import { channel } from "node:diagnostics_channel";
import prisma from "../../../lib/prisma"
import { redis } from "../../../utils/redis"

export const getMessagesByChannelID = async (channelId: string) => {
  try {
    const key = `channel-message:${channelId}`;
    const cached = await redis.lrange(key, 0, -1);

    console.log("CACHE LENGTH:", cached?.length);

    // ✅ CACHE PART (safe version)
    if (cached && cached.length > 0) {
      console.log("CACHE HIT");

      const parsed = [];

      for (const item of cached) {
        try {
          parsed.push(JSON.parse(item));
        } catch (err) {
          console.error("Bad cache item:", item);
        }
      }

      if (parsed.length > 0) {
        return {
          success: true,
          message: "Fetched from cache",
          data: parsed.reverse(),
          statusCode: 200,
        };
      } else {
        // corrupted cache → delete and fallback to DB
        await redis.del(key);
      }
    }

    // ✅ DB PART (THIS MUST EXIST)
    console.log("CACHE MISS → DB HIT");

    const messages = await prisma.message.findMany({
      where: { channelId },
      orderBy: { createdAt: "asc" },
      take: 50,
      include: { user: true },
    });

    console.log("DB RESULT COUNT:", messages.length);

    // ✅ CACHE WRITE (use pipeline ideally, but keep simple for now)
    for (const msg of messages) {
      await redis.lpush(key, JSON.stringify(msg));
    }
    await redis.ltrim(key, 0, 49);
    await redis.expire(key, 15 * 60);

    return {
      success: true,
      message: "Fetched from DB",
      data: messages,
      statusCode: 200,
    };
  } catch (error) {
    console.error("ERROR IN getMessagesByChannelID:", error);
    return {
      success: false,
      message: "Internal Server Error",
      statusCode: 500,
    };
  }
};

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
            data:newMessage,
            statusCode:201
        }


    } catch (error) {
        return{
            success:false,
            message:"Error sending message",
            statusCode:500
        }
    }


}

export const deleteChannelMessageByID = async(channelId:string,messageId:string,userId:string)=>{

    try {
    // 1. Find the message to verify it exists and check ownership
    const message = await prisma.message.findUnique({
      where: { id: messageId , channelId:channelId },

    });

    if (!message) {
      return { success: false, statusCode: 404, message: "Channel message not found" };
    }

    // 2. Ensure the user deleting the message is the one who sent it

    if (message.userId !== userId) {
      return { success: false, statusCode: 403, message: "Unauthorized to delete this message" };
    }

    // 3. Perform the deletion
    await prisma.message.delete({
      where: { id: messageId },
    });
    await redis.del(`channel-message:${message.channelId}`);

    return { success: true, statusCode: 200, message: "Message deleted successfully" };
  } catch (error) {
    console.error("Error in deleteChannelMessageByID service:", error);
    return { success: false, statusCode: 500, message: "Internal Server Error" };
  }

}


export const createChannelMessage = async (channelId: string, userId: string, content: string) => {
  try {
    const newMessage = await prisma.message.create({
      data: {
        channelId: channelId,
        userId: userId,
        content: content
      },
      include: { user: true }
    });

    // Update cache
    await redis.lpush(`channel-message:${channelId}`, JSON.stringify(newMessage));
    await redis.ltrim(`channel-message:${channelId}`, 0, 49);
    await redis.expire(`channel-message:${channelId}`, 15 * 60);

    return {
      success: true,
      message: "Message created successfully",
      data: newMessage,
      statusCode: 201
    };
  } catch (error) {
    console.error("Error in createChannelMessage service:", error);
    return {
      success: false,
      message: "Error creating message",
      statusCode: 500
    };
  }
};