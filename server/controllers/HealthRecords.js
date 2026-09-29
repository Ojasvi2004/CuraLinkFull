const { User } = require('../models/User');
const { PatientRecord } = require('../models/PatientRecord');
const axios = require('axios');
const curalink_ai=process.env.CURALINK_AI;
const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const AvailabiitySlot = require('../models/AvailabililitySlots');
const { Appointment } = require('../models/Appointment');
const { subtle } = require('crypto');
const { v2 } = require('cloudinary');
const { Prescription } = require('../models/prescriptions');
const uploadTocloudinary = async (FilePath, Folder) => {
  return await v2.uploader.upload(FilePath, {
    Folder,
    resource_type: 'auto',
  });
};

const uploadHealthRecord = async (req, res) => {
  let file;

  try {
    const { recordType, source, fileName, tags, metadata } = req.body;

    if (!recordType || !fileName) {
      return res.status(400).json({
        success: false,
        message: "recordType and fileName are required"
      });
    }

    file = req.files?.file?.[0];

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File is required"
      });
    }

    const upload = await uploadTocloudinary(file.path, "HealthRecord");

    const record = new PatientRecord({
      patientId: req._id,
      uploadedBy: req._id,
      recordType,
      recordDate: new Date(),
      facilityName: source,
      tags,
      fileUrl: upload.secure_url,
      fileName,
      metadata,
      isImaging: false,
      aiProcessing: {
        aiStandardizedSummary: null,
        isProcessedByAi: false
      }
    });

    await record.save();


    processOCRInBackground(record._id, upload.secure_url);

    return res.status(200).json({
      success: true,
      message: "Record uploaded successfully"
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error occurred in server while uploading"
    });

  } finally {
    if (file?.path) {
      const fs = require("fs/promises");
      await fs.unlink(file.path).catch(() => { });
    }
  }
};

const processOCRInBackground = async (recordId, imageUrl) => {
  try {
    console.log("Starting OCR for:", recordId);

    const ocr_data = await get_ocr_data(imageUrl);

    console.log("OCR RESULT:", ocr_data);

    if (!ocr_data) {
      throw new Error("OCR returned empty data");
    }

    const updated = await PatientRecord.findByIdAndUpdate(
      recordId,
      {
        $set: {
          "aiProcessing.aiStandardizedSummary": ocr_data,
          "aiProcessing.isProcessedByAi": true
        }
      },
      { new: true }
    );

    console.log("UPDATED RECORD:", updated);

  } catch (error) {
    console.error("BACKGROUND OCR ERROR:", error.message);
  }
};

const get_ocr_data = async (image_url) => {
  try {
    const response = await axios.post(
      `${curalink_ai}/ocr`,
      { image_url },
      { timeout: 900000 }
    );

    
    console.log("OCR RAW RESPONSE:", JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      return response.data.data;
    }


    throw new Error(`FastAPI returned failure: ${JSON.stringify(response.data)}`);

  } catch (error) {
    if (error.response) {
  
      console.error("OCR HTTP ERROR:", error.response.status, JSON.stringify(error.response.data));
    } else if (error.request) {
     
      console.error("OCR NO RESPONSE - is FastAPI running on port 5000?");
    } else {
      console.error("OCR ERROR:", error.message);
    }
    throw error;
  }
};

const GetHealthRecoordsOfUser = async (req, res) => {

  try {
    const _id = req._id;
    const allrecords = await PatientRecord.find({ patientId: _id });
    const formattedRecords = allrecords.map(record => ({
      _id: record._id,
      recordType: record.recordType,
      source: record.facilityName,
      date: record.recordDate,
      fileName: record.fileName,
      fileUrl: record.fileUrl,
      tags: record.tags || [],
      aiProcessing: record.aiProcessing
    }));
    return res.status(200).json({
      success: true,
      message: "These are all the health records of the user.",
      records: formattedRecords
    })

  } catch (error) {
    console.error(" ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error occurred while getting the helath records.",
      error: error.message,
      stack: error.stack
    });
  }

};

const DeleteHealthRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req._id;
    const record = await PatientRecord.findByIdAndDelete(id);
    if (record != null) {
      console.log("Succesfull deleted", record);
      return res.status(200).json({
        success: true,
        message: "Record Deleted"
      });
    }

    return res.status(400).json({
      success: false,
      message: "Record Cannot be Deleted"
    });


  } catch (error) {
    console.error(" ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error occurred while deleting the health records.",
      error: error.message,
      stack: error.stack
    });
  }
}

module.exports = {
  uploadHealthRecord,
  GetHealthRecoordsOfUser,
  DeleteHealthRecord
};
