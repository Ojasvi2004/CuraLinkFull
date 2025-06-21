const express=require('express');
const { RegisterDoctor, LoginDoctor } = require('../controllers/DoctorController');
const upload = require('../middlewares/multer');
const DoctorRoute=express.Router();


DoctorRoute.post('/register',upload.fields([
    {name:"profilePicture",maxCount:1},
    {name:"MedicalCertificate",maxCount:1},
    {name:"ClinicRegistrationCertificate",maxCount:1}
]),RegisterDoctor);

DoctorRoute.post('/login',LoginDoctor);

module.exports=DoctorRoute;