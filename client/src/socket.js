import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
    if (!socket) {
        const url = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        socket = io(url, {
            autoConnect: false
        });
    }
    return socket;
};

export const connectSocket = () => {
    const s = getSocket();
    if (!s.connected) {
        console.log('Connecting socket...');
        s.connect();
        s.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });
        s.on('connect', () => {
            console.log('Socket connected successfully:', s.id);
        });
    }
    return s;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
