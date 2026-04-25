import { Server } from 'socket.io';
import { prepareMessage } from './message';
import { verifyAccessToken } from './jwt';

export const setupSocket = (httpServer: any, FRONTEND_URL: string) => {
    const io = new Server(httpServer, {
        cors: {
            origin: FRONTEND_URL,
            methods: ['GET', 'POST']
        }
    });

    io.use((socket,next)=>{
        const token = socket.handshake.auth.token;
        if(!token) return next(new Error('Unauthorized..'))

        const decoded = verifyAccessToken(token);
        if(!decoded){
            return next(new Error('Unauthorized..'))
        }

        socket.data.userId = decoded.id;
        next()

    })

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}, User ID: ${socket.data.userId}`);

        socket.on('message', (data: { username: string, text: string }) => {
            io.emit('message', prepareMessage(data));
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};




