import mongoose from "mongoose";

// TODO: connect to groupId
const ChatSchema = mongoose.Schema({
  chatName: {
    type: String,
    required: true,
  },
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // only available if this is a group chat
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // messages: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Message",
  //     default: [],
  //   },
  // ],
});

const ChatModel = mongoose.model("Chat", ChatSchema);
export default ChatModel;
