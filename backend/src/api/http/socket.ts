import { Server, Socket } from "socket.io";
import http from "http";
import express from "express";
import Message from "@/db/models/messageModel.ts";
import Conversation from "@/db/models/chatModel.ts";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

// Define type for user socket map
const userSocketMap: { [key: string]: string } = {};

export const getRecipientSocketId = (recipientId: string): string | undefined => {
    return userSocketMap[recipientId];
};

io.on('connection', (socket: Socket) => {
    console.log("User connected", socket.id);
    const userId = socket.handshake.query.userId as string;

    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("markMessagesAsSeen", async ({ conversationId, userId }: { conversationId: string, userId: string }) => {
        try {
            await Message.updateMany({ conversationId: conversationId, seen: false }, { $set: { seen: true } });
            await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });
            io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
        } catch (error) {
            console.error(error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        const disconnectedUserId = Object.keys(userSocketMap).find(
            (key) => userSocketMap[key] === socket.id
        );

        if (disconnectedUserId) {
            delete userSocketMap[disconnectedUserId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});

export { io, server, app };