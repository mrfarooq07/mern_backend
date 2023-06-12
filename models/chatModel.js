const mongoLib = require("mongoose");

const chatModel = mongoLib.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [
      {
        type: mongoLib.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoLib.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoLib.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Chat = mongoLib.model("Chat", chatModel);
module.exports = Chat;
