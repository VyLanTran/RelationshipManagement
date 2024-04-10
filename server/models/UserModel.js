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
      default: "",
    },
    school: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    hometown: {
      type: String,
      default: "",
    },
    currentCity: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: Object,
      default: null,
    },
    coverPhoto: {
      type: Object,
      default: null,
    },
    friends: {
      type: Array, // array of userId of our friends
      default: [],
    },
    // social media links
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
