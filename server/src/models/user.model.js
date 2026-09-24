import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "seller"],
    default: "user",
  },
  passwordHash: {
    type: String,
    required: true,
  },
  refreshToken:{
    type:String
  }
});

const userModel = mongoose.model("user", userSchema);
export default userModel;
