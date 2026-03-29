// ─────────────────────────────────────────────────────────────────────────────
// Prescription.js  (Mongoose Model)
// Fix applied: mongoose.model() not mongoose.Schema.model()
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
    name:         { type: String, required: true },
    dosage:       { type: String },          // e.g. "500mg"
    frequency:    { type: String },          // e.g. "twice daily"
    duration:     { type: String },          // e.g. "7 days"
    instructions: { type: String },          // e.g. "take after meals"
});

const PrescriptionSchema = new mongoose.Schema({

    // ── Core References ────────────────────────────────────────────────────
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

    // ── Doctor Info ────────────────────────────────────────────────────────
    prescribedBy: {
        name:            { type: String, required: true },
        specialization:  { type: String },
        hospitalOrClinic:{ type: String },
    },

    // ── Prescription Details ───────────────────────────────────────────────
    prescriptionDate: { type: Date, required: true },
    uploadDate:       { type: Date, default: Date.now },
    expiryDate:       { type: Date },

    diagnosis:  { type: String },
    symptoms:   [{ type: String }],
    medications: [MedicationSchema],

    // ── File Storage ───────────────────────────────────────────────────────
    fileURL:  { type: String, required: true },
    fileType: {
        type: String,
        enum: ["image/jpeg", "image/png", "application/pdf"],
    },
    fileName: { type: String },
    fileSize: { type: Number },             // bytes

    // ── Organisation ──────────────────────────────────────────────────────
    tags: [{ type: String }],
    category: {
        type:    String,
        enum:    ["General", "Specialist", "Emergency", "Follow-up", "Lab Report", "Other"],
        default: "General",
    },

    // ── Status & Flags ─────────────────────────────────────────────────────
    status: {
        type:    String,
        enum:    ["active", "completed", "expired", "archived"],
        default: "active",
    },
    isVerified: { type: Boolean, default: false },
    isShared:   { type: Boolean, default: false },

    // ── Notes ──────────────────────────────────────────────────────────────
    patientNotes: { type: String, default: "" },
    metaData:     { type: String, default: "" },

}, { timestamps: true });   // adds createdAt & updatedAt automatically

// Compound index: fast "fetch all prescriptions for patient sorted by date"
PrescriptionSchema.index({ patientId: 1, prescriptionDate: -1 });

// ─── FIX: was  new mongoose.model(...)  →  must be  mongoose.model(...) ──────
const Prescription = mongoose.model('Prescription', PrescriptionSchema);

module.exports = { Prescription };