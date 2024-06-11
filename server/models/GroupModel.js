import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    admin: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const GroupModel = mongoose.model("Group", GroupSchema);
export default GroupModel;
