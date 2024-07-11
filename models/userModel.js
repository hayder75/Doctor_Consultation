const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true, // Default value for firstName
    },
    lastName: {
      type: String,
      required: true,// Default value for lastName
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetCode: { type: String },
    resetCodeExpires: { type: Date },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    seenNotifications: {
      type: Array,
      default: [],
    },
    unseenNotifications: {
      type: Array,
      default: [],
    },
    loginAttempts: { type: Number, default: 0 },
  lockoutUntil: { type: Date },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
