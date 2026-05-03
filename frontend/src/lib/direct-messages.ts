import { api } from "./axios"

export const getDirectMessages = async (conversationId: string) => {
  const { data } = await api.get(`/conversations/${conversationId}/messages`)
  return data.data
}

export const createDirectMessage = async(conversationId:string)=>{
    const{data}  = await api.post(`/conversations/${conversationId}/messages`)
    return data.data
}

export const deleteDirectMessage = async(conversationId:string,messageId:string)=>{
    await api.delete(`/conversations/${conversationId}/messages/${messageId}`)
}

