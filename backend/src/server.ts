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

app.use(express.json())
app.use(cors({
    origin: FRONTEND_URL || true,
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
