const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MedicalInfoSchema = new Schema({
  bloodType: {
    type: String,
    trim: true,
  },
  allergies: {
    type: [String], 
    default: [],
  },
  currentMedications: {
    type: [String], 
    default: [],
  },
  chronicConditions: {
    type: [String], 
    default: [],
  },
}, { _id: false }); 



const PatientSchema = new Schema({

  name: {
    type: String,
    required: [true, "Patient's full name is required."],
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Patient's date of birth is required."],
  },
  gender: {
    type: String,
    required: [true, "Patient's gender is required."],
    enum: ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'],
  },


  email: {
    type: String,
    required: [true, "Patient's email is required."],
    unique: true, 
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'],
  },
  phoneNumber: {
    type: String,
    unique:true,
    required: [true, "Patient's phone number is required."],
    trim: true,

  },


  passwordHash: {
    type: String,
    required: false,
  },
  accountStatus: {
    type: String,
    enum: ['INVITED', 'ACTIVE', 'SUSPENDED'],
    default: 'INVITED', // Default status when created by a doctor
  },


  medicalInfo: {
    type: MedicalInfoSchema,
    default: () => ({}), 
  },

  associatedDoctors: [{ // To track which doctors have this user as a patient
    type: Schema.Types.ObjectId,
    ref: 'Doctor', 
  }],
  // appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }]
  // prescriptions: [{ type: Schema.Types.ObjectId, ref: 'Prescription' }]

}, {
  timestamps: true, 
});


PatientSchema.methods.addAssociatedDoctor = function(doctorId) {
  if (this.associatedDoctors.indexOf(doctorId) === -1) {
    this.associatedDoctors.push(doctorId);
  }
  return this.save();
};

// PatientSchema.index({ email: 1 }); 
// PatientSchema.index({ name: 'text', 'medicalInfo.chronicConditions': 'text' }); 

const Patient = mongoose.model('Patient', PatientSchema);

module.exports = { Patient };