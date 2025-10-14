const express = require("express");
const {
  RegisterDoctor,
  LoginDoctor,
  CreateSlots,
  DeleteAllAvailabilitySlots,
  GetSlotOfDate,
  DeleteSingleSlot,
} = require("../controllers/DoctorController");
const upload = require("../middlewares/multer");
const DoctorAuth = require("../middlewares/DoctorAuth");
const DoctorRoute = express.Router();

DoctorRoute.post(
  "/register",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "MedicalCertificate", maxCount: 1 },
    { name: "ClinicRegistrationCertificate", maxCount: 1 },
  ]),
  RegisterDoctor
);

DoctorRoute.post("/login", LoginDoctor);

DoctorRoute.post("/createSlots", DoctorAuth, CreateSlots);

DoctorRoute.post("/deleteAllSlots", DeleteAllAvailabilitySlots);

DoctorRoute.post("/GetSlotsOfADate", GetSlotOfDate);

DoctorRoute.post("/deleteSingleSlot", DeleteSingleSlot);

module.exports = DoctorRoute;
