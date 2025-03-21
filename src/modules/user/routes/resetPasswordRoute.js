import express from "express";
import { requestPasswordReset } from "../../../../services/emailService.js";
import { resetPassword } from "../controller/userController.js";

const router = express.Router();

// Route to request password reset
router.post('/requestPasswordReset', requestPasswordReset);

// Route to reset password
router.put('/resetPassword', resetPassword);

export default router;
