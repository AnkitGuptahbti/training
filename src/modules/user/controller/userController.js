import { ErrorHandler, TryCatch } from "../../../../utilty/utility.js";
import { cookieOption, sendToken } from "../../../../utilty/features.js";
import jwt from "jsonwebtoken"
import {
  findUserByEmail,
  createUser,
  validateUserPassword,
  updateUserPassword,
  getAllUsersService,
  findUserById,
} from "../service/userService.js";
import User from "../model/userModel.js";
import redis from "../../../../services/redisClient.js";

export const registerUser = TryCatch(async (req, res, next) => {
  console.log("registerUser");
  const { username, email, password ,role} = req.body;

  if (!username || !email || !password) {
    return next(new ErrorHandler("All fields are required!", 400));
  }

  let user = await findUserByEmail(email);
  if (user) return next(new ErrorHandler("User already exists!", 400));

  user = await createUser(username, email, password,role);
  console.log("User created");

  sendToken(res, user, 201, "User registered successfully!");
});

export const loginUser = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return next(new ErrorHandler("Email and Password are required!", 400));

  let user = await findUserByEmail(email);
  if (!user) return next(new ErrorHandler("Invalid email or password!", 401));

  const isMatch = await validateUserPassword(user, password);
  if (!isMatch) return next(new ErrorHandler("Invalid email or password!", 401));

  sendToken(res, user, 200, "Login successful!");
});

export const handleLogout = TryCatch(async (req, res, next) => {
  return res
    .status(200)
    .cookie("authToken", "", { ...cookieOption, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

export const changePassword = TryCatch(async (req, res, next) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return next(new ErrorHandler("Email, old password, and new password are required!", 400));
  }

  const user = await findUserByEmail(email);
  if (!user) return next(new ErrorHandler("User not found!", 404));

  const isMatch = await validateUserPassword(user, oldPassword);
  if (!isMatch) return next(new ErrorHandler("Old password is incorrect!", 401));

  await updateUserPassword(user, newPassword);

  res.status(200).json({
    success: true,
    message: "Password updated successfully!",
  });
});

// export const getAllUsers = TryCatch(async (req, res, next) => {
//   const users = await getAllUsersService();
//   if (!users.length) return next(new ErrorHandler("No users found!", 404));

//   res.status(200).json({ success: true, users });
// });
export const getAllUsers = TryCatch(async (req, res, next) => {

  const {idfromparam}=req.params;
  console.log(req.user," user")
  // const cacheKey = req.user.userID;
  const cacheKey = req.user._id;
  
  const cachedUsers = await redis.get(cacheKey);
  if (cachedUsers) {
    return res.status(200).json({ success: true, users: JSON.parse(cachedUsers), source: "cache" });
  }

  const users = await getAllUsersService();
  if (!users.length) return next(new ErrorHandler("No users found!", 404));


  await redis.set(cacheKey, JSON.stringify(users), "EX", 3600);

  res.status(200).json({ success: true, users, source: "database" });
});

export const resetPassword = TryCatch(async (req, res, next) => {
  const { id, token } = req.query;
  const { password } = req.body;
  console.log(id,token,password)

  if (!id || !token || !password) {
    return next(new ErrorHandler("Invalid request parameters!", 400));
  }

  const user = await findUserById(id);
  if (!user) {
    return next(new ErrorHandler("User does not exist!", 404));
  }


  try {
    const secret = process.env.JWT_SECRET;
   const ver=  jwt.verify(token, secret);
   console.log(ver," ver")
    console.log(user," user")
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token!", 400));
  }
  const updatedUser = await updateUserPassword(user, password);

  if (!updatedUser) {
    return next(new ErrorHandler("Password update failed!", 500));
  }

  res.status(200).json({
    success: true,
    message: "Password has been reset successfully!",
  });
});




// Send Verification Email
export const sendVerificationEmail = TryCatch(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email is required!", 400));
  }

  const user = await findUserByEmail(email);
  if (!user) return next(new ErrorHandler("User not found!", 404));

  if (user.isEmailVerified) {
    return next(new ErrorHandler("Email is already verified!", 400));
  }

  // Generate verification token
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

  // Send verification email
  const verificationURL = `http://localhost:5000/api/um/users/verify-email?token=${token}`;
  await sendVerificationEmailService(user.email, verificationURL);

  res.status(200).json({
    success: true,
    message: "Verification email sent successfully!",
  });
});

// Verify Email
export const verifyEmail = TryCatch(async (req, res, next) => {
  const { token } = req.query;

  if (!token) return next(new ErrorHandler("Verification token is required!", 400));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserByEmail( decoded.email);

    if (!user) return next(new ErrorHandler("User not found!", 404));
    user.isEmailVerified = true;
    await user.save(); 

    res.status(200).json({
      success: true,
      message: "Email verified successfully!",
    });
  } catch (error) {
    console.log(error, "Error Occurred");
    return next(new ErrorHandler("Invalid or expired token!", 400));
  }
});


//delete user by admin
export const deleteUser = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  console.log("id", id)

  const user = await User.findOne({userID:id});
  console.log(user," user in controller")
  if (!user) return next(new ErrorHandler("User not found!", 404));

  await user.deleteOne()

  res.status(200).json({
    success: true,
    message: "User deleted successfully!",
  });
});


// cache middleware
export const cacheMiddleware = async (req, res, next) => {
  try {
    const cacheKey = "allUsers"; // Unique key for this API cache
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return res.json({ source: "cache", data: JSON.parse(cachedData) });
    }

    res.locals.cacheKey = cacheKey;
    next();
  } catch (error) {
    console.error("Redis Error:", error);
    next(); // Continue even if Redis fails
  }
};

export const setCache = async (key, data, expiry = 3600) => {
  await redis.set(key, JSON.stringify(data), "EX", expiry);
};