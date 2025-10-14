const v2 = require("../config/cloudinary");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Doctor = require("../models/Doctor");
const { Certificate } = require("crypto");
const fs = require("fs");
const { any } = require("../middlewares/multer");
const AvailabiitySlot = require("../models/AvailabililitySlots");
const { Clinic } = require("../models/Clinic");

const GenToken = async (userId) => {
  const exp = "1h";
  const RefreshToken = jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: exp,
  });

  return RefreshToken;
};

const HashPassword = async (password) => {
  const SaltRounds = 10;

  const Salt = await bcrypt.genSalt(SaltRounds);

  const hash = await bcrypt.hash(password, Salt);

  return hash;
};

const uploadTocloudinary = async (FilePath, Folder) => {
  return await v2.uploader.upload(FilePath, {
    Folder,
    resource_type: "auto",
  });
};

const LoginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    try {
      const profile = await Doctor.findOne({ Email: email });

      if (!profile) {
        return res
          .status(400)
          .json({ success: false, message: "Email is not registered." });
      }

      const isMatch = await bcrypt.compare(
        String(password),
        profile.PasswordHash
      );

      if (!isMatch) {
        return res
          .status(402)
          .json({ success: false, message: "Password or email is incorrect" });
      }

      const id = profile._id;

      const token = await GenToken(id);

      return res
        .status(200)
        .json({ success: true, message: "Login Successfull.", token: token });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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
      return res
        .status(400)
        .json({ message: "Passwords do not match", success: false });
    } else {
      const PasswordHash = await HashPassword(doctorPassword);

      const {
        MedicalCertificate,
        ClinicRegistrationCertificate,
        profilePicture,
      } = req.files;

      const ProfilePictureUpload = await uploadTocloudinary(
        profilePicture[0].path,
        "ProfilePictures"
      );

      const MedicalCertificateUpload = await uploadTocloudinary(
        MedicalCertificate[0].path,
        "Certificates"
      );
      const ClinicRegistrationCertificateUpload = await uploadTocloudinary(
        ClinicRegistrationCertificate[0].path,
        "Certificates"
      );

      fs.unlinkSync(req.files.MedicalCertificate[0].path);
      fs.unlinkSync(req.files.ClinicRegistrationCertificate[0].path);

      const clinicObj = new Clinic({
        name: clinicName,
        address: clinicStreet,
        city: clinicCity,
        state: clinicState,
        pincode: clinicPincode,
        clinicContact: clinicPhone,
      });

      await clinicObj.save();

      const newDoctor = new Doctor({
        FullName: doctorFullName,
        Email: doctorEmail,
        PhoneNumber: doctorPhone,
        MedicalRegistrationNumber: medicalRegNo,
        Qualifications: qualifications,
        Experience: experience,
        Bio: doctorBio,
        ClinicDetails: {
          name: clinicName,
          address: clinicStreet,
          city: clinicCity,
          state: clinicState,
          pincode: clinicPincode,
          clinicContact: clinicPhone,
        },
        Speciality: primarySpecialty,
        ServicesOffered: servicesOffered,
        InPersonConsultationFees: consultFeePhysical,
        DigitalConsultationFees: consultFeeDigital,
        PasswordHash,
        ProfilePicture: ProfilePictureUpload.secure_url,
        MedicalCertificate: MedicalCertificateUpload.secure_url,
        ClinicRegistrationCertificate:
          ClinicRegistrationCertificateUpload.secure_url,
      });

      console.log(newDoctor);

      await newDoctor.save();

      return res
        .status(200)
        .json({ message: "Your Profile Has Benn Created", success: true });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const CreateSlots = async (req, res) => {
  const { date, startTime, endTime, slotDuration, type, clinicId } = req.body;
  console.log(req.body, req._id);

  const currentTime = new Date(`${date}T${startTime}:00Z`);
  const blockEndTime = new Date(`${date}T${endTime}:00Z`);

     await AvailabiitySlot.deleteMany({
      doctorId: req._id,
      Date: date,
      $or: [
        {
          "Time.Start": { $gte: startTime, $lt: endTime },
        },
        {
          "Time.End": { $gt: startTime, $lte: endTime },
        },
      ],
    });

  let slots = [];
  let current = new Date(currentTime);

  if (currentTime >= blockEndTime) {
    return res
      .status(403)
      .json({ success: false, message: "Please select correct time." });
  }

  if (!slotDuration || slotDuration <= 0) {
    return res
      .status(403)
      .json({
        success: false,
        message: "Please select correct slot duration.",
      });
  }

  while (current < blockEndTime) {
    const slotStartTimeStr = current.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
    const slotEndTime = new Date(current.getTime() + slotDuration * 60000);
    if (slotEndTime > blockEndTime) break;
    const slotEndTimeStr = slotEndTime.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });

    const existingSlot = await AvailabiitySlot.findOne({
      doctorId: req._id,
      Date: date,
      "Time.Start": slotStartTimeStr,
      "Time.End":slotEndTimeStr
    });

    if (!existingSlot) {
      slots.push({

       slotId: `${req._id}_${date}_${slotStartTimeStr}_${slotEndTimeStr}`,


        doctorId: req._id,
        clinicId: clinicId,
        type: type,
        isBooked: false,
        Time: {
          Start: slotStartTimeStr,
          End: slotEndTimeStr,
        },
        Date: date,
      });
    }

    current = slotEndTime;
  }

  if (slots.length === 0) {
    return res.status(200).json({
      success: false,
      message: "No new slots created (possible duplicates).",
      slots: [],
    });
  }

  try {
    const savedSlots = await AvailabiitySlot.insertMany(slots);
    console.log(savedSlots);
    return res.status(201).json({
      success: true,
      message: "Slots created successfully.",
      slots: savedSlots,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error saving slots.",
      error: err.message,
    });
  }
};

const DeleteAllAvailabilitySlots = async (req, res) => {
  try {
    await AvailabiitySlot.deleteMany({});
    return res.json({ success: true, message: "All slots deleted" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting slots.",
      error: err.message,
    });
  }
};

const GetSlotOfDate= async(req,res)=>{
    const {date}=req.body;

    try {
        const AllSlotOfADay=await AvailabiitySlot.find({Date:date});

        return res.status(200).json({success:true,message:`These are he slots for ${date}`,AllSlotOfADay});

        
    } catch (error) {
         return res.status(500).json({
      success: false,
      message: "Error fetching slots.",
      error: err.message,
    });
    }

};

const DeleteSingleSlot=async(req,res)=>{

  try {
    
  const {id}=req.body;
  console.log(id);

  const deleted=await AvailabiitySlot.deleteOne({_id:id});

  if (!deleted) {
  return res.status(404).json({ success: false, message: "Slot not found" });
}


  return res.status(200).json({success:true,message:"Slot deleted"});

  } catch (error) {
     return res.status(500).json({
      success: false,
      message: "Error deleting slot.",
      error: error.message,
  });
}



};



module.exports = {
  RegisterDoctor,
  LoginDoctor,
  CreateSlots,
  DeleteAllAvailabilitySlots,
  GetSlotOfDate,
  DeleteSingleSlot
};
