import { io } from 'socket.io-client';
import { getAccessToken } from '../lib/axios';

export const socket = io('https://hive-gd6g.onrender.com', {
  autoConnect: false,
  auth: (cb) => {
    cb({token: getAccessToken()})
  }
});