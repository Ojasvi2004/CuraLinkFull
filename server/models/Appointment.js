const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    slotId: {
      type: mongoose.Schema.ObjectId,
      ref: "AvailabiitySlot",
      required: true,
    },
    patientName:{
      type:String,
      required:true
    },
    patientId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.ObjectId,
      ref: "Doctor",
      required: true,
    },
    clinicId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Clinic",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    doctorName:{
      type:String,
      required:true,
    },
    time: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled", "no_show"],
      default: "upcoming",
    },

    diagnosis: {
      type: String,
      default: "",
    },
    prescription: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String, 
      },
    ],   
    
    consultationType: {
      type: String,
      enum: ["InPerson", "Digital"],
      required: true,
    },
    
    
    feesPaid: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    createdBy: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
  },
  {
    timestamps: true, 
  }
);

const Appointment= new mongoose.model("Appointment", AppointmentSchema);

module.exports={Appointment};
