import { Server } from 'socket.io';
import { prepareMessage } from './message';
import { verifyAccessToken } from './jwt';
import { createDirectMessage } from '../modules/directMessage/directMessage.service';
import { createMessage } from '../modules/channel/channelMessage/channelMessage.service';
import { redis } from './redis';

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


        //--------------USER JOINS WORKSPACE--------------------------

        socket.on('join_workspace',async(workspaceId:string)=>{
            socket.join(`workspace:${workspaceId}`)
            console.log(`User ${socket.data.userId} joined workspace:${workspaceId}`)

            await redis.sadd(`online:${workspaceId}`,socket.data.userId);
            
            //safety net
            await redis.expire(`online:${workspaceId}`, 86400) // 24 hours

            socket.to(`workspace:${workspaceId}`).emit('user_online',{
                userId:socket.data.userId
            })

        })

        

        //-----------------------DIRECT MESSAGES--------------------------

        socket.on('join_conversation',(conversationId:string)=>{
            socket.join(`conversation${conversationId}`)
            console.log(`User ${socket.data.userId} joined conversation:${conversationId}`)
        })

        socket.on('send_dm',  async(conversationId:string,content:string)=>{
            const senderId = socket.data.userId;

            const message = await createDirectMessage(senderId as string,content,conversationId);

            io.to(`conversation:${conversationId}`).emit('new_dm',message)

        })

        socket.on('typing_start',(conversationId:string)=>{
            socket.to(`conversation:${conversationId}`).emit('user_typing',{
                userId:socket.data.userId
            })
        })

        socket.on('typing_stop',(conversationId:string)=>{
            socket.to(`conversation:${conversationId}`).emit('user_stop_typing',{
                userId:socket.data.userId
            })
        })


        //----------------------CHANNEL MESSAGES---------------------------

        socket.on('join_channel',(channelId:string)=>{
            socket.join(`channel${channelId}`)
            console.log(`User ${socket.data.userId} joined channel:${channelId}`)
        })

        socket.on('send_channel_message',  async(channelId:string,content:string)=>{
            const senderId = socket.data.userId;

            const ChannelMessage = await createMessage(senderId as string,content,channelId);

            io.to(`channel:${channelId}`).emit('new_channel_message',ChannelMessage)

        })

        socket.on('channel_typing_start',(channelId:string)=>{
            socket.to(`channel:${channelId}`).emit('user_typing',{
                userId:socket.data.userId
            })
        })


        socket.on('channel_typing_stop',(conversationId:string)=>{
            socket.to(`conversation:${conversationId}`).emit('user_stop_typing',{
                userId:socket.data.userId
            })
        })

        //----------------ONLINE MEMBERS----------------------
        socket.on('online_members', async (workspaceId: string) => {
            const onlineMembers = await redis.smembers(`online:${workspaceId}`)
            socket.emit('online_members', onlineMembers)
        })
        

        //-------------USER DISCONNECTS---------------
        
        socket.on('disconnect', async() => {
            const rooms = Array.from(socket.rooms)

            for(const room of rooms){
                if(room.startsWith('workspace:')){
                    const workspaceId = room.replace('workspace:', '')
                    await redis.srem(`online:${workspaceId}`, socket.data.userId)
      
                // broadcast offline to workspace
                io.to(room).emit('user_offline', {
                  userId: socket.data.userId
                })
                }
            }


            
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};




