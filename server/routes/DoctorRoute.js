const express = require("express");
const {
    RegisterDoctor,
    LoginDoctor,
    CreateSlots,
    DeleteAllAvailabilitySlots,
    GetSlotOfDate,
    DeleteSingleSlot,
    addPatient,
    getPatients,
    getDoctorData,
} = require("../controllers/DoctorController");
const upload = require("../middlewares/multer");
const DoctorAuth = require("../middlewares/DoctorAuth");
const {
    FetchAllAppointmentsForDoctors,
    FetchTodaysAppointmentForDoctors,
    handleAppointmentStatusAtLiveQueue,
} = require("../controllers/FetchAppointments");
const Doctor = require("../models/Doctor");
const { GetDoctorProfile, UpdateDoctorProfile } = require("../controllers/DoctorProfileController");
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

DoctorRoute.post("/login",
    LoginDoctor);

DoctorRoute.post("/createSlots",
    DoctorAuth,
    CreateSlots);

DoctorRoute.post("/deleteAllSlots",
    DeleteAllAvailabilitySlots);

DoctorRoute.post("/GetSlotsOfADate",
    GetSlotOfDate);

DoctorRoute.post("/deleteSingleSlot",
    DeleteSingleSlot);

DoctorRoute.get(
    "/getAppointmentsAll",
    DoctorAuth,
    FetchAllAppointmentsForDoctors
);

DoctorRoute.post(
    "/gettodayAppointment",
    DoctorAuth,
    FetchTodaysAppointmentForDoctors
);

DoctorRoute.post("/handleAppointment",
    handleAppointmentStatusAtLiveQueue);

DoctorRoute.post("/add-patient",
    DoctorAuth,
    addPatient);

DoctorRoute.get("/get-patients",
    DoctorAuth,
    getPatients);

DoctorRoute.get("/getDoctorData", DoctorAuth, getDoctorData);

DoctorRoute.get("/profile", DoctorAuth, GetDoctorProfile);
DoctorRoute.put("/update-profile", DoctorAuth, UpdateDoctorProfile);
module.exports = DoctorRoute;
