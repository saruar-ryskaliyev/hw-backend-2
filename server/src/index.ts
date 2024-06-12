import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './db';
import globalRouter from './global-router';
import chatRouter from './chat/chat-router';
import { logger } from './logger';
import ChatService from './chat/chat-service';
import cors from 'cors';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

connectDB();

app.use(logger);
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use('/api/v1/', globalRouter);
app.use('/api/v1/chat', chatRouter);


const io = new SocketIOServer(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    },
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('userConnected', (username) => {
        onlineUsers.set(username, socket.id);
        io.emit('updateUserStatus', { username, status: 'online' });
    });

    socket.on('disconnect', () => {
        const disconnectedUser = [...onlineUsers.entries()].find(([key, value]) => value === socket.id);
        if (disconnectedUser) {
            const [username] = disconnectedUser;
            onlineUsers.delete(username);
            io.emit('updateUserStatus', { username, status: 'offline' });
        }
        console.log('user disconnected');
    });

    socket.on('chat message', async (msg) => {
        console.log('message: ', msg);

        const { sender, receiver, message } = msg;
        try {
            const savedMessage = await ChatService.saveMessage(sender, receiver, message);
            io.emit('chat message', savedMessage); // Broadcast the message to all clients
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('typing', (data) => {
        console.log('typing: ', data);
        io.emit('typing', data); // Broadcast the typing event to all clients
    });
});

server.listen(PORT, () => {
    console.log(`Server runs at http://localhost:${PORT}`);
});
