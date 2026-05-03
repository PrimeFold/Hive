import prisma from "../../lib/prisma"

export const createConversation = async(currentUserId:string,targetId:string)=>{

    try {

        const existing = await prisma.conversation.findFirst({
            where:{
                OR:[
                    {participantOneId:currentUserId, participantTwoId:targetId},
                    {participantOneId:targetId, participantTwoId:currentUserId}
                ]
            }
        })

        if(existing){
            return {
                success: true,
                message: "Conversation already exists",
                data: existing,
                statusCode: 200
            };
        }

        const DM = await prisma.conversation.create({
            data:{
                participantOneId:currentUserId,
                participantTwoId:targetId,
                createdAt:new Date(Date.now())
            }
        })

        return {
            success:true,
            message:"Conversation created successfully!",
            data:DM,
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

export const deleteConversation = async(convoId:string)=>{

    try {
        
        const existing = await prisma.conversation.findFirst({
            where:{id:convoId}
        })

        if(!existing){
            return {
                success:false,
                message:"Conversation Does not exist",
                statusCode: 404
            }
        }

        await prisma.conversation.delete({
            where:{id:convoId}
        })

        return{
            success:true,
            message:"Conversation Deleted successfully",
            statusCode: 200
        }


    } catch (error) {
        
        return{
            success:false,
            message:"Internal Server Error",
            statusCode: 500
        }

    }


}

export const getAllConversations = async(userId:string)=>{

    try {
        const list = await prisma.conversation.findMany({
            where:{
                OR:[
                    {participantOneId:userId},
                    {participantTwoId:userId}
                ]
            },
            include:{
                participantOne: {
                  select: { id: true, displayName: true, username: true },
                },
                participantTwo: {
                  select: { id: true, displayName: true, username: true },
                },
                messages: {
                  orderBy: { createdAt: 'desc' },
                  take: 1, 
                  select: { content: true, createdAt: true },
                },
            }
        })

        return{
            success:true,
            message:"Successfully fetched all conversations..",
            data:list,
            statusCode: 200
        }

    } catch (error) {
        return {
            success:false,
            message:"Internal Server error..",
            statusCode: 500
        }
    }
}

export const getConversationByID = async(convoId:string)=>{

    try {
        
        const conversation = await prisma.conversation.findUnique({
            where:{id:convoId},
            select:{
                participantOneId:true,
                participantTwoId:true,
                createdAt:true
            }
        })

        if(!conversation){
            return {
                success:false,
                message:"Conversation Does not exist",
                statusCode: 404
            }
        }

        return{
            success:true,
            message:"fetched the conversation",
            data:conversation,
            statusCode: 200
        }

    } catch (error) {
        return {
            success:false,
            message:"Internal Server error..",
            statusCode: 500
        }
    }
}


