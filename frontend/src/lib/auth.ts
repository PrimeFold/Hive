import { api } from "./axios";


export const login = async(email:string,password:string)=>{
    const response = await api.post('/auth/login',{email,password});
    return response.data;
}

export const signup = async(username:string,email:string,password:string)=>{
    const response = await api.post('/auth/signup',{username,email,password})
    return response.data;
}


export const logout = async()=>{
    const response = await api.post('/auth/logout')
    return response.data;
}

export const forgotPassword = async(email: string,username:string,newPassword:string)=>{
    const response = await api.post('/auth/forgot-password', { email ,username,newPassword});
    return response.data;
}
