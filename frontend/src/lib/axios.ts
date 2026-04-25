import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http:localhost:3000'
let accessToken: string | null = null;


export const setAccessToken = ( token : string ) => accessToken = token;
export const clearAccessToken = () => accessToken = null;

const api = axios.create({
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
    (response)=>response,

    async(error)=>{
        const originalRequest = error.config

        if(error.resopnse?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`,{},
                    {withCredentials:true}
                )

                const newToken = response.data.accessToken;
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                setAccessToken(newToken);

                return api(originalRequest)
            } catch{
                clearAccessToken();
                window.dispatchEvent(new Event('auth:logout'))
                return Promise.reject(error)
            }
        }

        return Promise.reject(error)

    }
)

export default api;


















