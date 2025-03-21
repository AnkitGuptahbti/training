import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createUser = async (username, email, password,role) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await User.create({ username, email, passwordHash: hashedPassword ,role:role||"user"});
};

export const validateUserPassword = async (user, password) => {
  return await bcrypt.compare(password, user.passwordHash);
};



export const getAllUsersService = async () => {
  return await User.find({}, "-passwordHash");
};
export const findUserById = async (id) => {
  return await User.findById(id);
};
export const updateUserPassword = async (user, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.passwordHash = hashedPassword;
   return await user.save();
};

