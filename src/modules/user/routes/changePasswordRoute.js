
import express from 'express'
import validate from '../../../../middleware/validationMiddleware.js';
import { changePasswordSchema } from '../schema/userSchema.js';
import { changePassword } from '../controller/userController.js';

const router = express.Router();
router.post("/", validate(changePasswordSchema),changePassword)

export default router;

