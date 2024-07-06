const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
      default: [],
    },
  ],
  timestamp: { type: Date, default: Date.now },
});

const conversationModel = mongoose.model("Conversation", conversationSchema);
module.exports = conversationModel;
