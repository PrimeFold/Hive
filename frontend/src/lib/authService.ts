import { api } from "./axios";

export const refreshToken = async()=>{
    const {data} = await api.post(`${import.meta.env.VITE_API_URL }/refresh`)
    return data;
}
