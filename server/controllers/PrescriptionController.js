// ─────────────────────────────────────────────────────────────────────────────
// prescriptionController.js
// Compatible with:
//   • PrescriptionSchema  (mongoose model provided)
//   • MyPrescriptionsPage.jsx  (React frontend)
//   • multer for file uploads  →  uploadTocloudinary(file.path, folder)
// ─────────────────────────────────────────────────────────────────────────────

const { v2 } = require("cloudinary");          // ✅ FIX 1: was missing entirely
const { Prescription } = require("../models/prescriptions");

const uploadTocloudinary = async (filePath, folder) => {
  return await v2.uploader.upload(filePath, {
    folder,                                    // ✅ FIX 2: was `Folder` (uppercase) — Cloudinary expects lowercase `folder`
    resource_type: "auto",
  });
};

// ─── HELPER ──────────────────────────────────────────────────────────────────
// The React form sends prescribedBy as a JSON string inside FormData.
// This helper safely parses it whether it arrives as string or object.
const parsePrescribedBy = (raw) => {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  try { return JSON.parse(raw); } catch { return null; }
};

// Tags arrive as a JSON string from the React FormData: '["cardiology","bp"]'
const parseTags = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return []; }
};


// ─────────────────────────────────────────────────────────────────────────────
// 1. UPLOAD PRESCRIPTION
//    POST /api/prescriptions
//    Headers: Authorization: Bearer <token>
//    Body: multipart/form-data  (see React UploadModal for exact field names)
// ─────────────────────────────────────────────────────────────────────────────
const UploadPrescription = async (req, res) => {
  try {
    const file = req.file; // set by multer middleware

    // ── Auth guard ─────────────────────────────────────────────────────────
    const userId = req._id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // ── File guard ─────────────────────────────────────────────────────────
    if (!file) {
      return res.status(400).json({ success: false, message: "File is required" });
    }

    // ── Parse body fields ──────────────────────────────────────────────────
    const {
      prescriptionDate,
      uploadDate,
      diagnosis,
      category,
      patientNotes,
      metaData,
    } = req.body;

    const prescribedBy = parsePrescribedBy(req.body.prescribedBy);
    const tags         = parseTags(req.body.tags);

    // ── Validate required fields ───────────────────────────────────────────
    if (!prescribedBy?.name) {
      return res.status(400).json({ success: false, message: "prescribedBy.name is required" });
    }
    if (!prescriptionDate) {
      return res.status(400).json({ success: false, message: "prescriptionDate is required" });
    }

    const cloudinaryResult = await uploadTocloudinary(file.path, "Prescriptions");

    // ── Determine MIME type from Cloudinary result or original mimetype ────
    const mimeMap = {
      pdf:  "application/pdf",
      jpg:  "image/jpeg",
      jpeg: "image/jpeg",
      png:  "image/png",
    };
    const ext      = (cloudinaryResult.format || file.originalname?.split(".").pop() || "").toLowerCase();
    const fileType = mimeMap[ext] || file.mimetype || "application/pdf";

    const newPrescription = new Prescription({
      patientId:        userId,
      uploadedBy:       userId,
      prescribedBy: {
        name:             prescribedBy.name,
        specialization:   prescribedBy.specialization   || "",
        hospitalOrClinic: prescribedBy.hospitalOrClinic || "",
      },
      prescriptionDate: new Date(prescriptionDate),
      uploadDate:       uploadDate ? new Date(uploadDate) : new Date(),
      diagnosis:        diagnosis     || "",
      category:         category      || "General",
      patientNotes:     patientNotes  || "",
      metaData:         metaData      || "",
      tags,
      fileURL:          cloudinaryResult.secure_url,
      fileType,
      fileName:         file.originalname || cloudinaryResult.original_filename || "prescription",
      fileSize:         file.size || cloudinaryResult.bytes || 0,
      status:           "active",
      isVerified:       false,
    });

    await newPrescription.save();

    return res.status(201).json({
      success: true,
      message: "Prescription uploaded successfully",
      prescription: newPrescription,
    });

  } catch (error) {
    console.error("UploadPrescription ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while uploading prescription.",
      error: error.message,
    });
  }
};


const GetPrescriptionsForPatient = async (req, res) => {
  try {
    const userId = req._id || req.user?._id;
    const { patientId } = req.params;

    if (userId.toString() !== patientId.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const prescriptions = await Prescription
      .find({ patientId })
      .sort({ prescriptionDate: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      prescriptions,
      count: prescriptions.length,
    });

  } catch (error) {
    console.error("GetPrescriptionsForPatient ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching prescriptions",
      error: error.message,
    });
  }
};



// 3. GET SINGLE PRESCRIPTION BY ID
//    GET /api/prescriptions/:id
//    Headers: Authorization: Bearer <token>
// ─────────────────────────────────────────────────────────────────────────────
const GetPrescriptionById = async (req, res) => {
  try {
    const userId = req._id || req.user?._id;
    const { id }  = req.params;

    const prescription = await Prescription.findById(id).lean();

    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }

    if (prescription.patientId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    return res.status(200).json({ success: true, prescription });

  } catch (error) {
    console.error("GetPrescriptionById ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching prescription",
      error: error.message,
    });
  }
};

const UpdatePrescription = async (req, res) => {
  try {
    const userId = req._id || req.user?._id;
    const { id }  = req.params;

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }
    if (prescription.patientId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const ALLOWED = [
      "diagnosis", "category", "status", "patientNotes",
      "metaData", "tags", "expiryDate", "isShared",
    ];

    ALLOWED.forEach((field) => {
      if (req.body[field] !== undefined) {
        prescription[field] = req.body[field];
      }
    });

    await prescription.save();

    return res.status(200).json({
      success: true,
      message: "Prescription updated",
      prescription,
    });

  } catch (error) {
    console.error("UpdatePrescription ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating prescription",
      error: error.message,
    });
  }
};


const DeletePrescription = async (req, res) => {
  try {
    const userId = req._id || req.user?._id;
    const { id }  = req.params;

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }
    if (prescription.patientId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await Prescription.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Prescription deleted successfully",
    });

  } catch (error) {
    console.error("DeletePrescription ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting prescription",
      error: error.message,
    });
  }
};



module.exports = {
  UploadPrescription,
  GetPrescriptionsForPatient,
  GetPrescriptionById,
  UpdatePrescription,
  DeletePrescription,
};