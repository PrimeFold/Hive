import prisma from "../../lib/prisma"

export const getUserByDisplayName = async (displayName:string)=>{
    try {
        const friend = await prisma.user.findFirst({
            where:{displayName:displayName},
            select:{
                displayName:true,
                bio:true,
            }
        })

        if(!friend){
            return{
                success:false,
                message:"User not found !",
                statusCode:404
            }
        }

        return{
            success:true,
            message:"User found !",
            data:friend,
            statusCode:200
        }

    } catch (error) {
        return {
            success:false,
            message:"Internal Server Error"
        }
    }


}