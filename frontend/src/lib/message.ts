import { api } from "./axios"

export const getMessagesByChannelId = async(cid?:string)=>{
    const {data} = await api.get(`/channels/${cid}/messages`)
    return data;
}

export const createMessage=async(cid?:string)=>{
    const {data} = await api.post(`/channels/${cid}/messages`)
    return data.data;
}

