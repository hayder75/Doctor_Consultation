const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");

router.post("/send/:id", authMiddleware, async (req, res) => {
  // res.send({ message: "Login successful", success: true , userId:  req.body.userId })
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.body.userId;

    let conversation = await Conversation.findOne({
      partcipants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        partcipants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      //conversationId: conversatio._id
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // await conversation.save();
    // await newMessage.save();

    await Promise.all([conversation.save(),newMessage.save()])

    res.status(200).json(newMessage);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/:id", authMiddleware, async (req, res) => {

  try {
    const {id:userToChatId}= req.params;
    const senderId = req.body.userId;

    const conversation = await Conversation.findOne({
      partcipants:{$all : [senderId,userToChatId]},
    }).populate("messages");

    if(!conversation) return res.status(200).json([])

    const messages = conversation.messages;
    res.status(200).json(messages);

  } catch (error) {
    
  }

})
module.exports = router;
