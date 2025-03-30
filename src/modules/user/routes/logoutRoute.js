import express from "express";
import { handleLogout } from "../controller/userController.js";


const router = express.Router();

router.post("/",handleLogout);

export default router;
