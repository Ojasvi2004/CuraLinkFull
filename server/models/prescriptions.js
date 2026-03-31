const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
    name:         { type: String, required: true },
    dosage:       { type: String },
    frequency:    { type: String },
    duration:     { type: String },
    instructions: { type: String },
});

const PrescriptionSchema = new mongoose.Schema({

    patientId: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      "User",
        required: true,
        index:    true,
    },
    uploadedBy: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      "User",
        required: true,
    },

    prescribedBy: {
        name:             { type: String, required: true },
        specialization:   { type: String },
        hospitalOrClinic: { type: String },
    },

    prescriptionDate: { type: Date, required: true },
    uploadDate:       { type: Date, default: Date.now },
    expiryDate:       { type: Date },

    diagnosis:   { type: String },
    symptoms:    [{ type: String }],
    medications: [MedicationSchema],

    fileURL:  { type: String, required: true },
    fileType: {
        type: String,
        enum: ["image/jpeg", "image/png", "application/pdf"],
    },
    fileName: { type: String },
    fileSize: { type: Number },

    tags: [{ type: String }],
    category: {
        type:    String,
        enum:    ["General", "Specialist", "Emergency", "Follow-up", "Lab Report", "Other"],
        default: "General",
    },

    status: {
        type:    String,
        enum:    ["active", "completed", "expired", "archived"],
        default: "active",
    },
    isVerified: { type: Boolean, default: false },
    isShared:   { type: Boolean, default: false },

    patientNotes: { type: String, default: "" },
    metaData:     { type: String, default: "" },

}, { timestamps: true });


PrescriptionSchema.index({ patientId: 1, prescriptionDate: -1 });

const Prescription = mongoose.model('Prescription', PrescriptionSchema);

module.exports = { Prescription };