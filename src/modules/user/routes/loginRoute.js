


import express from 'express'

import validate from '../../../../middleware/validationMiddleware.js';
import { loginUser } from '../controller/userController.js';
import { userLoginSchema } from '../schema/userSchema.js';

const router = express.Router();
router.post("/", validate(userLoginSchema), loginUser);

export default router;
