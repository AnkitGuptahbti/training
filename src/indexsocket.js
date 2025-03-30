import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
});

app.use(express.json());
// rest routes


io.on("connection", (socket) => {
    console.log(`🟢 User Connected: ${socket.id}`);

    socket.on("sendMessage", (data) => {
        console.log("📩 Message received:", data);
        io.emit("receiveMessage", data); // Broadcast to all clients
    });

    socket.on("disconnect", () => {
        console.log(`🔴 User Disconnected: ${socket.id}`);
    });
});

server.listen(5000, () => console.log("🚀 Server running on port 5000"));
