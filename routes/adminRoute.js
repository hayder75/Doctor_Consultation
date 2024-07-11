const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/get-all-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).send({
      message: "Doctors fetched successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});

router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});

router.post(
  "/change-doctor-account-status",
  authMiddleware,
  async (req, res) => {
    try {
      const { doctorId, status } = req.body;
      const doctor = await Doctor.findByIdAndUpdate(doctorId, {
        status,
      });

      const user = await User.findOne({ _id: doctor.userId });
      const unseenNotifications = user.unseenNotifications;
      unseenNotifications.push({
        type: "new-doctor-request-changed",
        message: `Your doctor account has been ${status}`,
        onClickPath: "/notifications",
      });
      user.isDoctor = status === "approved" ? true : false;
      await user.save();
      const subject = 'Doctor Account Status Update';
       const message = Hello `${user.name},\n\nYour doctor account status has been ${status}.\n\nBest regards,\nYour Team `;
       await sendEmail(user.email, subject, message);

      res.status(200).send({
        message: "Doctor status updated successfully",
        success: true,
        data: doctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error applying doctor account",
        success: false,
        error,
      });
    }
  }
);

router.post(
  "/unblock-doctor-account",
  authMiddleware,
  async (req, res) => {
    try {
      const { doctorId } = req.body;

      // Find the doctor by ID and update the status to "approved" or any appropriate status
      const doctor = await Doctor.findByIdAndUpdate(doctorId, {
        status: "approved",
      });

      // Find the associated user and update their information
      const user = await User.findOne({ _id: doctor.userId });
      user.isDoctor = true; // Update as per your requirements
      await user.save();

      // Send a notification to the user if needed
      const unseenNotifications = user.unseenNotifications;
      unseenNotifications.push({
        type: "doctor-unblocked",
        message: "Your doctor account has been unblocked",
        onClickPath: "/notifications",
      });

      res.status(200).send({
        message: "Doctor unblocked successfully",
        success: true,
        data: doctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error unblocking doctor account",
        success: false,
        error,
      });
    }
  }
);

module.exports = router;
