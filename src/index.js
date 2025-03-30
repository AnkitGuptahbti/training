
import dotenv from "dotenv"
dotenv.config()


import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "../database/conn.js";
import { errorMiddleware } from "../utilty/utility.js";
import userRoutes from './modules/user/routes/main/userRoutes.js'
import { connectRabbitMQ } from "../services/rabbitMQClient.js";
import emailQueueRoutes from "./modules/user/routes/emailQueue.js";
import rateLimiter from "../middleware/rateLimiter.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: [process.env.REACT_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
connectDB(process.env.MONGO_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimiter); // Apply rate limiter globally

// We have one API (/api/um/users) with seven endpoints handling authentication, user management, and security features."

// one endpoint in thi api router.use("/",sendEmailRoute)//=>>>> this if for redis+bullmq //Background task(Task Queue) for sending email
app.use("/api/um/users", userRoutes);

app.get("/", (req, res) => {
  res.send({
    message:"Server is Running"
  });
});


//Background task(Task Queue) for sending email
//this if for rabbitmq 
connectRabbitMQ(); // Initialize RabbitMQ Connection
app.use("/api", emailQueueRoutes);

// paralley run in another terminal node workers/emailWorker.js => this is consumer so we can use rabbitmq  for background task  for sending email
//  node workers/emailWorker.js => this is consumer


app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`server listen on port ${PORT}`);
});
