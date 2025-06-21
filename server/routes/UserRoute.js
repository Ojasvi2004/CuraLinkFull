const  express=require("express");
const UserRoute=express.Router();
const { RegisterUser, LoginUser, GetDctorList}=require("../controllers/UserController.js") 



UserRoute.post("/register",  RegisterUser );
UserRoute.post("/login",LoginUser);
UserRoute.get("/getDoctorList",GetDctorList);
module.exports=UserRoute;


