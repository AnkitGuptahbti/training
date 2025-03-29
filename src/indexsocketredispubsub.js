

// Problem: Socket.io Without Redis
// 1️⃣ Limited to One Server:
// If you run multiple instances of your app, clients connected to one instance won’t receive messages from another.
// Example: A message sent from Server A won’t reach clients on Server B.
// 2️⃣ Scaling Issues:
// Load balancers distribute WebSocket connections across different servers.
// A client on one server might miss an event sent by another.

// ✅ Solution: Socket.io + Redis
// Redis Pub/Sub acts as a central message broker to sync events across multiple servers.

// ✔ Broadcast messages to all connected clients across different servers
// ✔ Scales WebSockets horizontally (Load balancers & multiple instances)
// ✔ Efficient (Redis is optimized for real-time messaging)




// run 2 different instances of this file
// run 2 different server on different port to test pubsub and redis 
// PORT=5000 node src/indexsocketredispubsub.js
// PORT=5001 node src/indexsocketredispubsub.js

import express from "express";
import { Server } from "socket.io";
import http from "http";
import Redis from "ioredis";
import redis from "../services/redisClient.js"; // Reuse Redis Client

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Create Redis Publisher & Subscriber (Separate instances)
const pubClient = redis; // Use existing Redis client for publishing
const subClient = new Redis({ host: "localhost", port: 6379 }); // Separate instance for subscribing

// Subscribe to Redis channel
subClient.subscribe("notifications", (err) => {
  if (err) console.error("❌ Redis Subscription Error:", err);
});

// Listen for messages from Redis and emit to clients
subClient.on("message", (channel, message) => {
  console.log(`📩 Received message from Redis channel ${channel}:`, message);
  io.emit("newNotification", message);
});

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("sendMessage", (data) => {
    console.log("📤 Publishing message to Redis:", data);
    pubClient.publish("notifications", JSON.stringify(data)); // Publish to Redis
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000; // Use provided port or default to 5000

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
