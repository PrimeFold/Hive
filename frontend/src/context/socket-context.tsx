
import { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const useSocketContext = () => useContext(SocketContext);

export default SocketContext;