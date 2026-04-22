import type { Message } from '../types/chat';

export const prepareMessage = ( data:{username:string,text:string} ): Message =>{

    return{
        ...data,
        id:Math.random().toString(36).substring(2,10),
        timestamp: new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    }
}