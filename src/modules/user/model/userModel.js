import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence"; // Import the plugin

const AutoIncrement = AutoIncrementFactory(mongoose); // Initialize the plugin

const UserSchema = new mongoose.Schema({
  userID: { type: Number, unique: true }, 
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },

  role:{
    type:String,
    enum: ["USER", "ADMIN","EMPLOYEE"],
    default: "USER"
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.UUID, ref: "users" },
  modifiedBy: { type: mongoose.Schema.Types.UUID, ref: "users" },
});

// Apply the auto-increment plugin for `userID`
UserSchema.plugin(AutoIncrement, { inc_field: "userID" });


const User = mongoose.model("User", UserSchema);
export default User;
