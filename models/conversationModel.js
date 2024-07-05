// backend/models/Message.js
const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  particpants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
      default:[],
    },
  ],
  timestamp: { type: Date, default: Date.now },
});

const conversationModel= mongoose.model("Conversation", conversationSchema); // Replace "Messages" with your actual model name
module.exports = conversationModel;
