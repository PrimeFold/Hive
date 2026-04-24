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
                data: existing
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
            data:DM
        }

    } catch (error) {
        return {
            success:false,
            message:"Internal Server Error"
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
                message:"Conversation Does not exist"
            }
        }

        await prisma.conversation.delete({
            where:{id:convoId}
        })

        return{
            success:true,
            message:"Conversation Deleted successfully"
        }


    } catch (error) {
        
        return{
            success:false,
            message:"Internal Server Error"
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
            }
        })

        if(!list){
            return {
                success:false,
                message:"No Conversations found .."
            }
        }

        return{
            success:true,
            message:"Successfully fetched all conversations..",
            data:list
        }

    } catch (error) {
        return {
            success:false,
            message:"Internal Server error.."
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
                message:"Conversation Does not exist"
            }
        }

        return{
            success:true,
            message:"fetched the conversation",
            data:conversation
        }

    } catch (error) {
        return {
            success:false,
            message:"Internal Server error.."
        }
    }
}


