import { api } from "@/lib/axios"

export const createConversation = async(userId:string)=>{
    const {data} = await api.post(`/conversation/${userId}`)
    return data.data
}
export const getAllConversations = async()=>{
    const {data} = await api.get(`/conversations`)
    return data.data
}
export const getConversationById = async(cid:string)=>{
    const {data} = await api.get(`/conversation/${cid}`)
    return data.data
}
export const deleteConversation = async(userId:string)=>{
    const {data} = await api.delete(`/conversation/${userId}`)
    return data.data
}