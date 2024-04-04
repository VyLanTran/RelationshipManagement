import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      requied: true,
    },
    password: {
      type: String,
      require: true,
    },
    company: {
      type: String,
    },
    school: {
      type: String,
    },
    phone: {
      type: String,
    },
    hometown: {
      type: String,
    },
    currentCity: {
      type: String,
    },
    // social media links
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
