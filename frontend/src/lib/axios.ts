import axios from 'axios'
import { refreshToken } from './authService';

const ACCESS_TOKEN_KEY = 'hive_access_token';
let accessToken: string | null = null;
let isRefreshing = false;
let subscribers : ((token:string)=>void)[] = [];
let onAuthFailure: (() => void) | null = null;

const readStoredAccessToken = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

const writeStoredAccessToken = (token: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

const removeStoredAccessToken = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
};

accessToken = readStoredAccessToken();

const subscribe = (cb:(token:string)=>void)=>{
    subscribers.push(cb);
}

export const notifySubscribers = (token: string) => {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
};


export const setAccessToken = (token:string) => {
  accessToken = token;
  writeStoredAccessToken(token);
};

export const getAccessToken = () => {
  if (!accessToken) {
    accessToken = readStoredAccessToken();
  }
  return accessToken;
};

export const clearAccessToken = () => {
  accessToken = null;
  removeStoredAccessToken();
};

export const setAuthFailureHandler = (handler: (() => void) | null) => {
  onAuthFailure = handler;
};

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const api = axios.create({
    baseURL:BASE_URL,
    withCredentials:true
})

api.interceptors.request.use((config)=>{
    const token = getAccessToken();
    if(token){
        config.headers.Authorization = `Bearer ${token}`
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
                        isRefreshing = false;
                        return api(originalRequest);

                    } catch (error) {

                        clearAccessToken();
                        onAuthFailure?.();
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
