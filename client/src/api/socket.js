import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    query: {
        userId: null
    }
});

export const connectSocket = (userId) => {
    socket.io.opts.query.userId = userId;
    socket.connect();
}

export default socket;