import User from "../src/modules/user/model/userModel.js";
import { ErrorHandler, TryCatch } from "../utilty/utility.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = TryCatch(async (req, res, next) => {
  const token = req.cookies.authToken;
  // console.log("token:", token);

  if (!token) {
    return next(new ErrorHandler("Please login to access this route", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded._id).select("-passwordHash"); // =Fetch user details
  // console.log("user from isAuthenticated:", user)

  if (!user) {
    return next(new ErrorHandler("User not found!", 404));
  }

  req.user = user; // Store the entire user object
  next();
});

export const isAdmin = TryCatch(async (req, res, next) => {
  // console.log("Checking admin role...");

  if (!req.user) {
    return next(new ErrorHandler("Unauthorized!", 401));
  }

  if (req.user.role !== "ADMIN") {
    return next(new ErrorHandler("Access denied! Admins only.", 403));
  }

  // console.log("Admin access granted!");
  next();
});

export const isAuthorized = (allowedRoles) => {
  return (req, res, next) => {
    // console.log("Allowed Roles:", allowedRoles);
    // console.log("User Role:", req.user?.role); 

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized! No user found." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied!" });
    }
    next();
  };
};
