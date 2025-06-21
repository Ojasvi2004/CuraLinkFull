const  express=require("express");
const UserRoute=express.Router();
const { RegisterUser, LoginUser, GetDctorList, GetDoctor}=require("../controllers/UserController.js") 



UserRoute.post("/register",  RegisterUser );
UserRoute.post("/login",LoginUser);
UserRoute.get("/getDoctorList",GetDctorList);
UserRoute.get("/getDoctorProfile/:doctorId",GetDoctor);
module.exports=UserRoute;


