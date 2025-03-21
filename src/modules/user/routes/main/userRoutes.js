import express from "express";
import signupRoute from "../signupRoute.js";
import loginRoute from "../loginRoute.js";
import changePasswordRoute from "../changePasswordRoute.js";
import getAllUsersRoute from "../getAllUsersRoute.js"
import resetPasswordRoute from "../resetPasswordRoute.js";
import verifyEmailRoute from "../verifyEmailRoute.js";
import deleteUserRoute from "../deleteUserRoute.js";
import { isAdmin, isAuthenticated, isAuthorized ,} from "../../../../../middleware/auth.js";
import { cacheMiddleware } from "../../controller/userController.js";


const router = express.Router();
router.use("/signup", signupRoute);
router.use("/login", loginRoute);
router.use(isAuthenticated);
router.use("/get-all-users", isAuthorized(["USER", "EMPLOYEE", "ADMIN"]),getAllUsersRoute);
router.use("/change-password",changePasswordRoute);
router.use("/",resetPasswordRoute)
router.use("/", verifyEmailRoute)
// router.use("/",isAdmin,deleteUserRoute)
router.use("/",isAdmin,deleteUserRoute)

export default router;
