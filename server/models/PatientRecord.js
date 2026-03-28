const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PatientRecordSchema = new Schema(
  {

    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recordType: {
      type: String,
      enum: [
        "Lab Report",
        "Discharge Summary",
        "Vaccination",
        "Imaging",
        "X-Ray",
        "Doctor Note",
        "Other",
      ],
      required: true,
    },
    recordDate: { type: Date, required: true },
    facilityName: { type: String, trim: true, default: "Self" },
    tags: [{ type: String, trim: true, lowercase: true }],
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: {
      type: String,
      enum: ["pdf", "image/jpeg", "image/png", "image/jpg", "other"],
      default: "other",
    },
    metadata: {
      summary: { type: String, default: "" },
      notes: { type: String, default: "" },
    },
    aiProcessing: {// Filled by OCR ion background
      aiStandardizedSummary: { type: mongoose.Schema.Types.Mixed,default: "" }, 
      isProcessedByAi: { type: Boolean, default: false },
    },
    isImaging: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

// --- INDEXES FOR FAST SEARCHING ---
// PatientRecordSchema.index({ patientId: 1, recordDate: -1 });
// PatientRecordSchema.index({ tags: 1 });

const PatientRecord = new  mongoose.model("PatientRecord", PatientRecordSchema);
module.exports = { PatientRecord };