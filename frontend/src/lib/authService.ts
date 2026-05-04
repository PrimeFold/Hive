import { api } from "./axios";

export const refreshToken = async()=>{
    console.log('Calling /refresh endpoint...');
    try {
        const {data} = await api.post('/refresh')
        console.log('Refresh response:', data);
        return data;
    } catch (error: any) {
        console.error('Refresh endpoint error:', {
            status: error?.response?.status,
            statusText: error?.response?.statusText,
            data: error?.response?.data,
            message: error?.message
        });
        throw error;
    }
}
