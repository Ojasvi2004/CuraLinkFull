const mongoose = require("mongoose");

const {  Addressmodel } = require("./Address.js");

const Usermodel = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, "Please use a valid email address."]
        },
        passwordHash: {
            type: String,
            required: true,
        },

        phoneNumber: {
            type: String,
            default: "",
        },

        dateOfBirth: {
            type: String,
            default: "",
        },

        gender: {
            type: String,
            enum: ["", "Male", "Female", "Non-binary", "Other", "Prefer not to say"],
            default: "",
        },

        profilePictureUrl: {
            type: String,
            default: "",
        },

        address: {
            type: Addressmodel,
            default: {
                street: "",
                city: "",
                pincode: null,
                country:"",
                state:""
            },
        },

        Appointments: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "AvailibilitySlot",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const User = new mongoose.model("User", Usermodel);

module.exports = { User };
