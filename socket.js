// const http = require('http');
// const express = require('express');
// const { Server } = require('socket.io');
// //const Message = require('./models/messageModel'); // Assuming Message is a model
// const User = require('./models/userModel');
// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"],
//     },
// });

// const userSocketMap = {}; // {userId: socketId}

// io.on("connection", (socket) => {
//     console.log("a user connected", socket.id);

//     const userId = socket.handshake.query.userId;
//     if (userId !== "undefined") userSocketMap[userId] = socket.id;

//     socket.on("joinRoom", ({ userId, doctorId }) => {
//         const roomId = `${userId}-${doctorId}`;
//         socket.join(roomId);
//         console.log(`User ${userId} joined room ${roomId}`);
//     });

//     socket.on("sendMessage", async ({ roomId, senderId, receiverId, message }) => {
//         const newMessage = new Message({ roomId, senderId, receiverId, message });
//         await newMessage.save();
//         io.to(roomId).emit("receiveMessage", newMessage);
//     });

//     socket.on("disconnect", () => {
//         console.log("user disconnected", socket.id);
//         delete userSocketMap[userId];
//     });
// });

// module.exports = { app, server };
