const Doctor = require("../models/Doctor"); // adjust path


const uploadTocloudinary = async (FilePath, Folder) => {
  return await v2.uploader.upload(FilePath, {
    Folder,
    resource_type: "auto",
  });
};

const fs = require("fs");

const removeTempFile = (file) => {
  if (file && file.path) {
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error("Failed to delete temp file:", err.message);
      }
    });
  }
};





const GetDoctorProfile = async (req, res) => {
  try {
    const doctorId = req._id;
    if (!doctorId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const doctor = await Doctor.findById(doctorId).select("-PasswordHash");
    if (!doctor) {
      return res
        .status(404)
        .json({ message: "Doctor not found", success: false });
    }

    return res.status(200).json({ success: true, doctor });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message, success: false });
  }
};


const UpdateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req._id;
    if (!doctorId) {
      removeTempFile(req.file);
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const {
      PhoneNumber,
      Bio,
      ServicesOffered,
      InPersonConsultationFees,
      DigitalConsultationFees,
      clinicStreet,
      clinicCity,
      clinicState,
      clinicPincode,
      clinicPhone,
    } = req.body;

    const set = {};
    const unset = {};


    if (PhoneNumber !== undefined) {
      const digits = String(PhoneNumber).replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 13) {
        removeTempFile(req.file);
        return res
          .status(400)
          .json({ message: "Enter a valid phone number", success: false });
      }
      set.PhoneNumber = Number(digits);
    }

    if (Bio !== undefined) {
      if (!String(Bio).trim()) {
        removeTempFile(req.file);
        return res
          .status(400)
          .json({ message: "Bio cannot be empty", success: false });
      }
      set.Bio = String(Bio).trim();
    }

    if (ServicesOffered !== undefined) {
      if (!String(ServicesOffered).trim()) {
        removeTempFile(req.file);
        return res
          .status(400)
          .json({ message: "Services offered cannot be empty", success: false });
      }
      set.ServicesOffered = String(ServicesOffered).trim();
    }


    if (InPersonConsultationFees !== undefined) {
      const fee = Number(InPersonConsultationFees);
      if (InPersonConsultationFees === "" || Number.isNaN(fee) || fee < 0) {
        removeTempFile(req.file);
        return res
          .status(400)
          .json({ message: "Enter a valid in-person fee", success: false });
      }
      set.InPersonConsultationFees = fee;
    }

    if (DigitalConsultationFees !== undefined) {
      if (DigitalConsultationFees === "") {
        unset.DigitalConsultationFees = ""; 
      } else {
        const fee = Number(DigitalConsultationFees);
        if (Number.isNaN(fee) || fee < 0) {
          removeTempFile(req.file);
          return res
            .status(400)
            .json({ message: "Enter a valid digital fee", success: false });
        }
        set.DigitalConsultationFees = fee;
      }
    }

    const clinicFields = {
      "ClinicDetails.address": clinicStreet,
      "ClinicDetails.city": clinicCity,
      "ClinicDetails.state": clinicState,
      "ClinicDetails.pincode": clinicPincode,
      "ClinicDetails.clinicContact": clinicPhone,
    };
    for (const [path, value] of Object.entries(clinicFields)) {
      if (value !== undefined) set[path] = String(value).trim();
    }


    if (req.file) {
      const upload = await uploadTocloudinary(req.file.path, "ProfilePictures");
      removeTempFile(req.file);
      set.ProfilePicture = upload.secure_url;
    }

    if (Object.keys(set).length === 0 && Object.keys(unset).length === 0) {
      return res
        .status(400)
        .json({ message: "No changes to update", success: false });
    }

    const update = {};
    if (Object.keys(set).length) update.$set = set;
    if (Object.keys(unset).length) update.$unset = unset;

    const doctor = await Doctor.findByIdAndUpdate(doctorId, update, {
      new: true,
      runValidators: true,
    }).select("-PasswordHash");

    if (!doctor) {
      return res
        .status(404)
        .json({ message: "Doctor not found", success: false });
    }

    return res.status(200).json({
      message: "Profile updated",
      success: true,
      doctor,
    });
  } catch (error) {
    removeTempFile(req.file);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: error.message, success: false });
    }
    return res
      .status(500)
      .json({ message: "Server error", error: error.message, success: false });
  }
};

module.exports = { GetDoctorProfile, UpdateDoctorProfile };