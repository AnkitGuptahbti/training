
import dotenv from "dotenv"
dotenv.config()


import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "../database/conn.js";
import { errorMiddleware } from "../utilty/utility.js";
import userRoutes from './modules/user/routes/main/userRoutes.js'

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

// We have one API (/api/um/users) with seven endpoints handling authentication, user management, and security features."
app.use("/api/um/users", userRoutes);

app.get("/", (req, res) => {
  res.send({
    message:"Server is Running"
  });
});


app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`server listen on port ${PORT}`);
});
