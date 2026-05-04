import express from 'express';
import helmet from 'helmet';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { router } from './utils/router';
import { pool } from './db';
import { setupSocket } from './utils/socket';
import './routes/auth/auth.route';
import './routes/user/user.route';
import './routes/workspaces/workspace.route';
import './routes/channels/channel.route';
import './routes/channels/channelMessage.route';
import './routes/conversations/conversations.route';
import './routes/directMessages/directMessage.route';
import './routes/friends/friends.routes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL;
app.set('trust proxy', 1) 
app.use(express.json())
const corsOrigin = FRONTEND_URL || (process.env.NODE_ENV === 'production' ? false : true);
console.log('CORS Origin:', corsOrigin);
console.log('FRONTEND_URL:', FRONTEND_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
app.use(cors({
    origin: corsOrigin,
    credentials: true,
}));
app.use(helmet());
app.use(cookieParser());
app.use('/',router)

setupSocket(httpServer, FRONTEND_URL as string);

pool.connect((err, client, release) => {
    if (release) release();
});

httpServer.listen(PORT);
