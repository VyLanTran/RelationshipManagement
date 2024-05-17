import mongoose from "mongoose";

const DiarySchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
    },
    admin: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
    },
    entry: {
        type: String,
    }
  },
  { timestamps: true }
);

const Diary = mongoose.model("Diary", DiarySchema);
export default Diary;
