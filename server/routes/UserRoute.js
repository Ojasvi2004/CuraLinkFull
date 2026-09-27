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
  EditUserAddress,
  EditUserProfile,
  DeleteUser,
  GetProfileData
} = require("../controllers/UserController.js");

const {
      uploadHealthRecord,
  GetHealthRecoordsOfUser,
  DeleteHealthRecord,
}=require("../controllers/HealthRecords.js")
const UserAuth = require("../middlewares/UserAuth.js");
const { FetchAppointmentsForPatient } = require("../controllers/FetchAppointments.js");
const upload = require("../middlewares/multer.js");
const { User } = require("../models/User.js");

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
UserRoute.delete("/deleteUserRecord/:id",UserAuth,DeleteHealthRecord);
UserRoute.post("/editPersonalInfo",UserAuth,EditUserProfile);
UserRoute.post("/editUserAddress",UserAuth,EditUserAddress);
UserRoute.delete("/deleteUser",UserAuth,DeleteUser);
UserRoute.get("/getProfile",UserAuth,GetProfileData);
module.exports = UserRoute;
