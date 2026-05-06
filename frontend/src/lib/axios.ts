import axios from 'axios'
import { refreshToken } from './authService';

let accessToken : string | null =  null;
let isRefreshing = false;
let subscribers : ((token:string)=>void)[] = [];

const subscribe = (cb:(token:string)=>void)=>{
    subscribers.push(cb);
}

export const notifySubscribers = (token: string) => {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
};


export const setAccessToken = (token:string) => accessToken = token;
export const getAccessToken = () =>  accessToken;
export const clearAccessToken = () => accessToken = null;

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const api = axios.create({
    baseURL:BASE_URL,
    withCredentials:true
})

api.interceptors.request.use((config)=>{
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
})


api.interceptors.response.use(
    (response) => response,

    async(error)=>{
        const originalRequest = error.config;

        if(error.response?.status === 401 && !originalRequest._retry ){

            if(!isRefreshing){
                isRefreshing = true;
                try {
                        originalRequest._retry = true;
                        const response = await refreshToken();

                        const newAccessToken = response.accessToken;
                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                        setAccessToken(newAccessToken);
                        notifySubscribers(newAccessToken);
                        window.dispatchEvent(new Event('auth:token_refreshed'))
                        isRefreshing = false;
                        return api(originalRequest);

                    } catch (error) {

                        clearAccessToken();
                        window.dispatchEvent(new Event('auth:logout'))
                        isRefreshing = false;
                        return Promise.reject(error)
                }
            }else{
                return new Promise((resolve)=>{
                    subscribe((token:string)=>{
                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        resolve(api(originalRequest))
                    })
                })
            }



        }

        return Promise.reject(error);

    }
)
