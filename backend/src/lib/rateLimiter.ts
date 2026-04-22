import rateLimit from "express-rate-limit";


export const Limiter = (options:{
    windowMs:number;
    max:number;
    message?:string;
})=>{
    return rateLimit(options)
}



