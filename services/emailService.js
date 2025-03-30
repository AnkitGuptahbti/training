  import nodemailer from "nodemailer";
  import User from "../src/modules/user/model/userModel.js";
  import jwt from "jsonwebtoken";
  import { ErrorHandler, TryCatch } from "../utilty/utility.js";

  export const requestPasswordReset = TryCatch(async (req, res, next) => {
    const { email } = req.body;

    if (!email) return next(new ErrorHandler("Email is required!", 400));

    const user = await User.findOne({ email });
    if (!user) return next(new ErrorHandler("User doesn't exist", 404));

    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: "1h" });//3m/1h

    const resetURL = `http://localhost:5000/api/um/users/resetPassword?id=${user._id}&token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset Request",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${resetURL}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset link sent", resetURL });
  });

  
  //sendVerificationEmail
  export const sendVerificationEmail = TryCatch(async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(new ErrorHandler("Email is required!", 400));

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User doesn't exist", 404));

  if (user.isEmailVerified) return next(new ErrorHandler("Email already verified!", 400));

  const secret = process.env.JWT_SECRET;
  const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: "1h" });

  const verificationURL = `http://localhost:5000/api/um/users/verify-email?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL_USER,
    subject: "Email Verification",
    text: `Please click on the following link to verify your email:\n\n${verificationURL}\n\nIf you did not request this, please ignore this email.`,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({ message: "Verification email sent!", verificationURL });
});