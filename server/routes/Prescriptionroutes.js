const express  = require("express");
const multer   = require("multer");
const PrescriptionRoute   = express.Router();
const UserAuth = require("../middlewares/UserAuth.js");

const {
  UploadPrescription,
  GetPrescriptionsForPatient,
  GetPrescriptionById,
  UpdatePrescription,
  DeletePrescription,
} = require("../controllers/PrescriptionController");





const upload = multer({ dest: "tmp/" });


PrescriptionRoute.get("/patient/:patientId", UserAuth, GetPrescriptionsForPatient);


PrescriptionRoute.get("/:id", UserAuth, GetPrescriptionById);


PrescriptionRoute.post("/", UserAuth, upload.single("file"), UploadPrescription);


PrescriptionRoute.put("/:id", UserAuth, UpdatePrescription);


PrescriptionRoute.delete("/:id", UserAuth, DeletePrescription);

module.exports = PrescriptionRoute;