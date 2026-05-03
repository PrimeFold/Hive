import { io } from 'socket.io-client';
import { getAccessToken } from '../lib/axios';

export const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false,
  auth: (cb) => {
    cb({token: getAccessToken()})
  }
});