import mongoose from "mongoose";
import UserModel from "UserModel.js";

const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: UserModel,
      },
    ],
  },
  { timestamps: true }
);

const GroupModel = mongoose.model("Group", GroupSchema);
export default GroupModel;