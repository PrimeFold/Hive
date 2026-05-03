import { api } from "./axios";

export const refreshToken = async()=>{
    const {data} = await api.post('/refresh')
    return data.data;
}
