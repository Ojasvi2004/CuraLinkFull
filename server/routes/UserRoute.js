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
} = require("../controllers/UserController.js");
const UserAuth = require("../middlewares/UserAuth.js");
const { FetchAppointmentsForPatient } = require("../controllers/FetchAppointments.js");

UserRoute.post("/register", RegisterUser);
UserRoute.get("/getAppointmentsAll",UserAuth,FetchAppointmentsForPatient);
UserRoute.post("/login", LoginUser);
UserRoute.get("/getDoctorList", GetDctorList);
UserRoute.get("/getDoctorProfile/:doctorId", GetDoctor);
UserRoute.post("/getSlotsOfDoctor", GetAvailabilitySlotsForUser);
UserRoute.post("/bookSlot",UserAuth,BookSlot);
UserRoute.get("/getUserData",UserAuth,GetUserData);
module.exports = UserRoute;
