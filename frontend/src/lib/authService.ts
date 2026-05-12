import { api } from "./axios";

export const refreshToken = async()=>{
    const {data} = await api.post('/refresh')
    return data;
}

export const getCurrentUser = async () => {
    const { data } = await api.get('/user/me');
    return data;
}
