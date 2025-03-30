import express from "express";
const router = express.Router();
import { verifyEmail } from "../controller/userController.js";
import { sendVerificationEmail } from "../../../../services/emailService.js";

// Route to send verification email
router.post("/send-verification-email", sendVerificationEmail);

// Route to verify email
router.get("/verify-email", verifyEmail);

export default router;
