import express from 'express';
import helmet from 'helmet';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { router } from './utils/router';
import { setupSocket } from './utils/socket';

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

setupSocket(httpServer, FRONTEND_URL as string);


httpServer.listen(PORT,()=>{
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})





