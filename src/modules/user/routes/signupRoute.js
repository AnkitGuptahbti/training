import express from "express";
// import { userSignupSchema } from "../schema/userSchema";
import validate from "../../../../middleware/validationMiddleware.js";
import { registerUser } from "../controller/userController.js";
import { userSignupSchema } from "../schema/userSchema.js";

const router = express.Router();
router.post("/", validate(userSignupSchema) ,registerUser );

export default router;