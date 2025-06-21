const mongoose=require("mongoose");
const Clinic = require("./Clinic");
const ClinicSchema = require("./Clinic");

const DoctorModel= new mongoose.Schema({

    FullName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },

    PhoneNumber:{
        type:Number,
        required:true
    },
    MedicalRegistrationNumber:{
        type:Number,
        required:true
    },
    Qualifications:{
        type:String,
        required:true
    },
    Experience:{
        type:Number,
        required:true
    },
    Bio:{
        type:String,
        required:true
    },
    ClinicDetails:{
        type:ClinicSchema,
        required:true
    },
    Speciality:{
        type:String,
        required:true
    },
    ServicesOffered:{
        type:String,
        required:true
    },
    InPersonConsultationFees:{
        type:Number,
        required:true
    },
    
    DigitalConsultationFees:{
        type:Number,
    },
    ProfilePicture:{
        type:String,
        required:true
    },

    PasswordHash:{
        type:String,
        required:true
    },

    MedicalCertificate:{
        type:String,
        required:true
    },
    ClinicRegistrationCertificate:{
        type:String,
        required:true
    }

},{
    timestamps:true
});

const Doctor=new mongoose.model("Doctor",DoctorModel);

module.exports=Doctor;