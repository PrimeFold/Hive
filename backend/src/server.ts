import express from 'express';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { prepareMessage } from './utils/message';
import cookieParser from 'cookie-parser';
import { router } from './utils/router';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(express.json())
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use('/',router)

const io = new Server(httpServer,{
    cors:{
        origin: FRONTEND_URL,
        methods: ['GET', 'POST']
    }
})

io.on("connection",(socket)=>{

    socket.on('message',(data:{username:string,text:string})=>{
        io.emit('message',prepareMessage(data));
    })
    
    io.on('disconnect',()=>{
        console.log(`User disconnected : ${socket.id}`)
    })

})


httpServer.listen(PORT,()=>{
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})





