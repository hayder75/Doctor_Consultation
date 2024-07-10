const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Conversation = require("../models/conversationModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");
const moment = require("moment");
const nodemailer = require('nodemailer')
require('dotenv').config();




router.get('/get-all-users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users); // Use res.json for JSON responses
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching users",
      success: false,
      error,
    });
  }
});


router.get('/get-conversations', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
      });
    }

    // Efficiently find conversations where the user is a participant
    const conversations = await Conversation.find({
      participants: { $in: [user._id] },
    }).exec();

    // Filter conversation participant IDs (excluding the current user)
    const participantIds = conversations.flatMap(conv =>
      conv.participants.filter(participant => participant.toString() !== user._id.toString())
    );

    // Fetch all user details for conversation participants
    const participants = await User.find({ _id: { $in: participantIds } });

    // Transform participants data to match the structure of doctors data
    const transformedParticipants = participants.map(participant => ({
      address: participant.address || '',
      userId: participant._id.toString(),
      firstName: participant.firstName || '',
      lastName: participant.lastName || '',
      phoneNumber: participant.phoneNumber || '',
      website: participant.website || '',
      specialization: participant.specialization || '',
      experience: participant.experience || '',
      feePerCunsultation: participant.feePerCunsultation || 0,
      timings: participant.timings || [],
      status: participant.status || '',
    }));

    res.status(200).json(transformedParticipants);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching conversations",
      success: false,
      error,
    });
  }
});



router.get("/get-all-approved-doctor", async (req, res) => {
  try {
    // Fetch approved doctors
    const doctors = await Doctor.find({ status: "approved" });

    // Fetch the corresponding user data for each approved doctor
    const users = await Promise.all(
      doctors.map(async (doctor) => {
        const user = await User.findById(doctor.userId);
        return user;
      })
    );

    // Respond with the user data
    res.status(200).json(users); // Use res.json for JSON responses
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching doctors",
      success: false,
      error,
    });
  }
});


router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, name ,email, password } = req.body;

    // User existence check
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }

    // Password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res
      .status(200)
      .send({ message: "User created successfully", success: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error });
  }
});



router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res
        .status(200)
        .send({
          message: "Login successful",
          success: true,
          data: token,
          userId: user._id,
        });
      //.json({ userId: user._id, name: user.name });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error logging in", success: false, error });
  }
});


router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    } else {
      res.status(200).send({
        message:"current user0",
        success: true,
        data: user,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, error });
  }
});


router.post("/apply-doctor-account", authMiddleware, async (req, res) => {
  try {
    const newdoctor = new Doctor({ ...req.body, status: "pending" });
    await newdoctor.save();
    const adminUser = await User.findOne({ isAdmin: true });

    const unseenNotifications = adminUser.unseenNotifications;
    unseenNotifications.push({
      type: "new-doctor-request",
      message: `${newdoctor.firstName} ${newdoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newdoctor._id,
        name: newdoctor.firstName + " " + newdoctor.lastName,
      },
      onClickPath: "/admin/doctorslist",
    });
    await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
    res.status(200).send({
      success: true,
      message: "Doctor account applied successfully",
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
  "/mark-all-notifications-as-seen",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });
      const unseenNotifications = user.unseenNotifications;
      const seenNotifications = user.seenNotifications;
      seenNotifications.push(...unseenNotifications);
      user.unseenNotifications = [];
      user.seenNotifications = seenNotifications;
      const updatedUser = await user.save();
      updatedUser.password = undefined;
      res.status(200).send({
        success: true,
        message: "All notifications marked as seen",
        data: updatedUser,
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

router.post("/delete-all-notifications", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.seenNotifications = [];
    user.unseenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications cleared",
      data: updatedUser,
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

router.get("/get-all-approved-doctors",authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });
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


router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    //pushing notification to doctor based on his userid
    const user = await User.findOne({ _id: req.body.doctorInfo.userId });
    user.unseenNotifications.push({
      type: "new-appointment-request",
      message: `A new appointment request has been made by ${req.body.userInfo.name}`,
      onClickPath: "/doctor/appointments",
    });
    await user.save();
    res.status(200).send({
      message: "Appointment booked successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      error,
    });
  }
});

router.post("/check-booking-avilability", authMiddleware, async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await Appointment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not available",
        success: false,
      });
    } else {
      return res.status(200).send({
        message: "Appointments available",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      error,
    });
  }
});

router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.body.userId });
    res.status(200).send({
      message: "Appointments fetched successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching appointments",
      success: false,
      error,
    });
  }
});

// serach

// router.get("/search", authMiddleware, async (req, res) => {
//   try {
//     const { q } = req.query;
//     if (!q) {
//       return res.status(400).send('Query parameter "q" is required');
//     }

//     const doctors = await Doctor.find({
//       $and: [
//         { status: "approved" },
//         {
//           $or: [
//             { firstName: { $regex: q, $options: "i" } },
//             { lastName: { $regex: q, $options: "i" } },
//             { specialization: { $regex: q, $options: "i" } },
//             { email: { $regex: q, $options: "i" } }
//           ]
//         }
//       ]
//     });

//     if (doctors.length === 0) {
//       return res.status(200).send({
//         message: "No doctors found",
//         success: false
//       });
//     }

//     res.status(200).send({
//       message: "Doctors found successfully",
//       success: true,
//       data: doctors
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       message: "Error searching for doctors",
//       success: false,
//       error
//     });
//   }
// });

router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).send('Query parameter "q" is required');
    }

    const doctor = await Doctor.find({
      $or: [
        { firstName: { $regex: q, $options: "i" } },
        { lastName: { $regex: q, $options: "i" } },
        { specialization: { $regex: q, $options: "i" } },
      ],
    });

    if (!doctor) {
      return res.status(200).send({
        message: "No doctor found",
        success: false,
      });
    }

    res.status(200).send({
      message: "Doctor found successfully",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error searching for doctor",
      success: false,
      error,
    });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await Doctor.findOne({ userId: req.body.userId });
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }
    res.status(200).send({ data: user.status, success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error fetching user data", success: false, error });
  }
});


// mail 

router.post('/forgot-password', async (req, res) => {
  try {
    console.log('Received request for forgot password');

    const oldUser = await User.findOne({ email: req.body.email });
    if (!oldUser) {
      return res.status(200).send({ message: "User does not exist", success: false });
    }

    // Generate a random 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated reset code:', resetCode);

    // Hash the reset code
    const salt = await bcrypt.genSalt(10);
    const hashedResetCode = await bcrypt.hash(resetCode, salt);
   // console.log('Hashed reset code:', hashedResetCode);

    // Save the hashed reset code and set an expiration time (e.g., 20 minutes)
    oldUser.resetCode = hashedResetCode;
    oldUser.resetCodeExpires = Date.now() + 20 * 60 * 1000; // 20 minutes from now
    await oldUser.save();
    console.log('Reset code saved to user record');

    // Send the code via email
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or any other service
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: oldUser.email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${resetCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        return res.status(500).send({ message: "Error sending email", success: false, error });
      }
      console.log('Email sent: ' + info.response);
      res.status(200).send({ message: "Password reset code has been sent", success: true });
    });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send({ message: "Something went wrong", success: false, error });
  }
});
module.exports=router;
router.post("/verify-reset-code", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const oldUser = await User.findOne({ email: email });
    if (!oldUser) {
      return res.json({ status: "User does not exist" });
    }

    // Check if the code is expired
    if (Date.now() > oldUser.resetCodeExpires) {
      return res.status(400).send({ message: "Reset code has expired", success: false });
    }

    // Verify the reset code
    const isMatch =  bcrypt.compare(code, oldUser.resetCode);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid reset code", success: false });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password and clear the reset code
    oldUser.password = hashedPassword;
    oldUser.resetCode = undefined;
    oldUser.resetCodeExpires = undefined;
    await oldUser.save();

    res.status(200).send({ message: "Password has been reset successfully", success: true });
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Something went wrong", error });
  }
});

module.exports = router;
