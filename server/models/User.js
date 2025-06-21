const mongoose = require("mongoose");

const { Address, Addressmodel } = require("./Address.js");

const Usermodel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique:true,
      required: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Non-binary", "Other", "Prefer not to say"],
    },
    profilePictureUrl: {
      type: String,
      default: null,
    },
    address: {
      type: Addressmodel,
    },
  },
  {
    timestamps: true,
  }
);

const User = new mongoose.model("User", Usermodel);

module.exports = { User };
