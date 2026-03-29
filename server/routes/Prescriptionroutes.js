// ─────────────────────────────────────────────────────────────────────────────
// prescriptionRoutes.js
// Mount in app.js / server.js:
//   const prescriptionRoutes = require('./routes/prescriptionRoutes');
//   app.use('/api/prescriptions', prescriptionRoutes);
// ─────────────────────────────────────────────────────────────────────────────

const express  = require("express");
const multer   = require("multer");
const router   = express.Router();

const {
  UploadPrescription,
  GetPrescriptionsForPatient,
  GetPrescriptionById,
  UpdatePrescription,
  DeletePrescription,
} = require("../controllers/PrescriptionController"); // adjust path

const { isAuthenticated } = require("../middlewares/auth"); // adjust path — your JWT middleware

// ── Multer: store temporarily in /tmp before Cloudinary upload ────────────────
const upload = multer({ dest: "tmp/" });

// ─── ROUTES ──────────────────────────────────────────────────────────────────

// GET all prescriptions for a patient
//   Called by React:  GET /api/prescriptions/patient/:patientId
router.get("/patient/:patientId", isAuthenticated, GetPrescriptionsForPatient);

// GET single prescription
//   Called by React:  GET /api/prescriptions/:id
router.get("/:id", isAuthenticated, GetPrescriptionById);

// POST upload new prescription
//   Called by React:  POST /api/prescriptions   (multipart/form-data, field name = "file")
router.post("/", isAuthenticated, upload.single("file"), UploadPrescription);

// PUT update prescription metadata
//   Called by React:  PUT /api/prescriptions/:id   (JSON body)
router.put("/:id", isAuthenticated, UpdatePrescription);

// DELETE prescription
//   Called by React:  DELETE /api/prescriptions/:id
router.delete("/:id", isAuthenticated, DeletePrescription);

module.exports = router;