import express from "express";
import { sendEmail } from "../controller/userController.js";

const router = express.Router();

router.post("/send-email", sendEmail);

export default router;
