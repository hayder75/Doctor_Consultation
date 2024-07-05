// backend/models/Message.js
const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true

    },
    message: {
        type:String,
        required: true
    },
    timestamp: { type: Date, default: Date.now }
});

const messagesModel = mongoose.model("messages", messageSchema); // Replace "Messages" with your actual model name
module.exports = messagesModel;
