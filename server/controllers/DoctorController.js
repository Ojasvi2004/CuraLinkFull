const v2 = require("../config/cloudinary");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Doctor = require("../models/Doctor");
const { Certificate } = require("crypto");
const fs=require('fs');
const { any } = require("../middlewares/multer");

const GenToken = async (userId) => {
    const exp = "1h";
    const RefreshToken = jwt.sign({ userId }, process.env.SECRET_KEY, {
        expiresIn: exp,
    });

    return RefreshToken;
};


const HashPassword = async (password) => {

    const SaltRounds = 10;

    const Salt =await bcrypt.genSalt(SaltRounds);

    const hash =await bcrypt.hash(password, Salt);

    return hash;

}

const uploadTocloudinary = async (FilePath, Folder) => {
    return await v2.uploader.upload(FilePath, {
        Folder,
        resource_type: "auto"
    });
};


const LoginDoctor=async(req,res)=>{
    try {

        const {email,password}=req.body;

        try {
            const profile=await Doctor.find({email});

            if (!profile) 
            {
                return res.status(400).json({success:false,message:"Email is not registered."});    
            }

            const id=profile._id;

            const token=await GenToken(id);

            return res.status(200).json({success:true,message:"Login Successfull.",token:token});
            
        } catch (error) {
            
        }
        
    } catch (error) {
         if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }


}

const RegisterDoctor = async (req, res) => {


    try {

        const {
           doctorFullName,
            doctorEmail,
            doctorPhone,
            medicalRegNo,
           qualifications,
            experience,
            doctorBio,
            clinicName,
            clinicStreet,
            clinicCity,
            clinicState,
            clinicPincode,
            clinicPhone,
            primarySpecialty,
            servicesOffered,
           consultFeePhysical,
           consultFeeDigital,
           acceptsDigital,
           doctorPassword,
            doctorConfirmPassword,

        } = req.body;

        if (doctorPassword != doctorConfirmPassword) {
            return res.status(400).json({ message: "Passwords do not match", success: false });
        }

        else {

            const PasswordHash = await HashPassword(doctorPassword);

            const {MedicalCertificate, ClinicRegistrationCertificate,profilePicture}=req.files;

            const ProfilePictureUpload=await uploadTocloudinary(profilePicture[0].path,"ProfilePictures");

            const MedicalCertificateUpload=await uploadTocloudinary(MedicalCertificate[0].path,"Certificates");
            const ClinicRegistrationCertificateUpload= await uploadTocloudinary(ClinicRegistrationCertificate[0].path,"Certificates");

             fs.unlinkSync(req.files.MedicalCertificate[0].path);
             fs.unlinkSync(req.files.ClinicRegistrationCertificate[0].path) ;

            //  let clinicObject;

            //  try {
            //     clinicObject=JSON.parse(req.body.ClinicDetails);
            //  } catch (error) {
            //     return res.status(400).json({ message: "Invalid ClinicDetails JSON" });
            //  }


            const newDoctor = new Doctor({

                FullName:doctorFullName,
                Email:doctorEmail,
                PhoneNumber:doctorPhone,
                MedicalRegistrationNumber:medicalRegNo,
                Qualifications:qualifications,
                Experience:experience,
                Bio:doctorBio,
                ClinicDetails:{
                    name:clinicName,
                    address:clinicStreet,
                    city:clinicCity,
                    state:clinicState,
                    pincode:clinicPincode,
                    clinicContact:clinicPhone,
                },
                Speciality:primarySpecialty,
                ServicesOffered:servicesOffered,
                InPersonConsultationFees:consultFeePhysical,
                DigitalConsultationFees:consultFeeDigital,
                PasswordHash,
                ProfilePicture:ProfilePictureUpload.secure_url,
                MedicalCertificate:MedicalCertificateUpload.secure_url,
                ClinicRegistrationCertificate:ClinicRegistrationCertificateUpload.secure_url,
                

            });

            console.log(newDoctor);

            await newDoctor.save();

            return res.status(200).json({message:"Your Profile Has Benn Created",success:true});



        }

    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }


};




module.exports = { RegisterDoctor,LoginDoctor };
