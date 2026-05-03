import { api } from "./axios"

export const createChannel = async(name:string,wid?:string)=>{
    const {data} = await api.post(`/workspaces/${wid}/channel`,{name})
    return data.data;
}

export const getChannels = async(id?:string)=>{
    const {data} = await api.get(`/workspaces/${id}/channels`)
    return data.data;
}

export const getChannelById = async(wid?:string,cid?:string)=>{
    const {data} = await api.get(`/workspaces/${wid}/channels/${cid}`)
    return data.data;
}

export const updateChannelById = async(wid?:string,cid?:string)=>{
    const {data} = await api.get(`/workspaces/${wid}/channels/${cid}`)
    return data.data;
}

export const deleteChannelById =  async(wid?:string,cid?:string)=>{
    await api.delete(`/workspaces/${wid}/channels/${cid}`)
}
