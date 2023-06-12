const mongoLib = require("mongoose");

const messageModel = mongoLib.Schema(
  {
    sender: { type: mongoLib.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoLib.Schema.Types.ObjectId, ref: "Chat" },
  },
  {
    timestamps: true,
  }
);

const Message = mongoLib.model("Message", messageModel);
module.exports = Message;
