const express = require("express");
const UserRoute = express.Router();
const {
  RegisterUser,
  LoginUser,
  GetDctorList,
  GetDoctor,
  GetAvailabilitySlotsForUser,
  BookSlot,
  GetUserData,
  uploadHealthRecord,
  GetHealthRecoordsOfUser,
  DeleteHealthRecord,
} = require("../controllers/UserController.js");
const UserAuth = require("../middlewares/UserAuth.js");
const { FetchAppointmentsForPatient } = require("../controllers/FetchAppointments.js");
const upload = require("../middlewares/multer.js");

UserRoute.post("/register", RegisterUser);
UserRoute.get("/getAppointmentsAll", UserAuth, FetchAppointmentsForPatient);
UserRoute.post("/login", LoginUser);
UserRoute.get("/getDoctorList", GetDctorList);
UserRoute.get("/getDoctorProfile/:doctorId", GetDoctor);
UserRoute.post("/getSlotsOfDoctor", GetAvailabilitySlotsForUser);
UserRoute.post("/bookSlot", UserAuth, BookSlot);
UserRoute.get("/getUserData", UserAuth, GetUserData);
UserRoute.post("/uploadHealthRecord", UserAuth, upload.fields([
  {
    name: "file", maxCount: 1
  }
]), uploadHealthRecord);
UserRoute.get("/getHealthRecordsForUser",UserAuth, GetHealthRecoordsOfUser);
UserRoute.delete("/deleteUserRecord/:id",UserAuth,DeleteHealthRecord)
module.exports = UserRoute;
