import express from "express"
import { deleteUser } from "../controller/userController.js"

const router = express.Router()

router.delete("/:id", deleteUser)

export default router