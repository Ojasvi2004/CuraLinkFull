const { User } = require('../models/User');
const { PatientRecord } = require('../models/PatientRecord');
const axios = require('axios')
const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const AvailabiitySlot = require('../models/AvailabililitySlots');
const { Appointment } = require('../models/Appointment');
const { subtle } = require('crypto');
const { v2 } = require('cloudinary');
const { Prescription } = require('../models/prescriptions');



const GenToken = async (userId) => {
    const exp = '5h';
    const RefreshToken = jwt.sign({ id: userId }, process.env.SECRET_KEY, {
        expiresIn: exp,
    });
    return RefreshToken;
};

const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(401)
            .json({ success: false, message: 'All fields are required.' });
    }
    try {
        const myUser = await User.findOne({ email });

        if (!myUser) {
            return res
                .status(404)
                .json({ success: false, message: 'User is not registered' });
        }
        const myUserHash = myUser.passwordHash;
        const bool = await bcrypt.compare(password, myUserHash);

        if (bool == false) {
            return res
                .status(401)
                .json({ success: false, message: 'Password is incorrect' });
        }
        const token = await GenToken(myUser._id);
        return res
            .status(200)
            .json({ success: true, message: 'Login Successfull', token });
    } catch (error) {
        return res.status(400).json({ success: false, message: `Error: ${error}` });
    }
};

const HashPassword = async (password) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedpassword = await bcrypt.hash(password, salt);

    return hashedpassword;
};

const RegisterUser = async (req, res) => {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
        return res
            .status(401)
            .json({ success: false, message: 'All fields are required.' });
    }
    if (password != confirmPassword) {
        return res.send(406).json({
            success: false,
            message: 'Password and ConfirmPassword does not match.',
        });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res
                .status(406)
                .json({ success: false, message: 'User Already Exists' });
        }

        const userHashPassword = await HashPassword(password);

        const myUser = new User({
            name: fullName,
            email: email,
            passwordHash: userHashPassword,
        });
        console.log(myUser);

        await myUser.save();

        res.status(201).json({ success: true, message: 'User Created' });
    } catch (error) {
        console.error(" ERROR:", error);

        return res.status(400).json({
            message: "Error while registering user ",
            error: error.message,
            stack: error.stack
        });
    }
};

const GetDctorList = async (req, res) => {
    try {
        const doctorList = await Doctor.find({});

        return res
            .status(202)
            .json({ success: true, message: 'Successfull Fetching', doctorList });
    } catch (error) {
        return res.status(400).json({ success: false, message: `Error: ${error}` });
    }
};

const GetDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const doctorProfile = await Doctor.findById(doctorId);

        return res
            .status(202)
            .json({ success: true, message: 'Successfull Fetching', doctorProfile });
    } catch (error) {
        console.error(" ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Error occurred in server while uploading",
            error: error.message,
            stack: error.stack
        });
    }
};

const GetAvailabilitySlotsForUser = async (req, res) => {
    try {
        const { doctorId, date } = req.body;

        const AllSlots = await AvailabiitySlot.find({
            doctorId: doctorId,
            Date: date,
        });

        return res
            .status(200)
            .json({ success: true, message: 'Successfull Slots Fetching', AllSlots });
    } catch (error) {
        console.error(" ERROR:", error);

        return res.status(400).json({
            success: false,
            message: "Error ",
            error: error.message,
            stack: error.stack
        });
    }
};

const BookSlot = async (req, res) => {
    try {
        const { id } = req.body;
        const _id = req._id;
        console.log(_id);

        const selectedSlot = await AvailabiitySlot.findOne({ _id: id });

        if (!selectedSlot) {
            return res
                .status(404)
                .json({ success: false, message: 'Slot not found' });
        }

        if (selectedSlot.isBooked == false) {
            selectedSlot.isBooked = true;
            selectedSlot.patientId = _id;
            console.log(selectedSlot);
            await selectedSlot.save();

            const doctor = await Doctor.findOne({ _id: selectedSlot.doctorId });
            const patient = await User.findOne({ _id });

            const dname = doctor.FullName;
            const pname = patient.name;

            const AppointmentForSlot = new Appointment({
                slotId: selectedSlot._id,
                patientId: _id,
                patientName: pname,
                doctorName: dname,
                doctorId: selectedSlot.doctorId,
                clinicId: selectedSlot.clinicId,
                date: selectedSlot.Date,
                time: {
                    start: selectedSlot.Time.Start,
                    end: selectedSlot.Time.End,
                },
                consultationType: 'InPerson',
                status: 'upcoming',
            });

            await AppointmentForSlot.save();

            return res
                .status(200)
                .json({ success: true, message: 'Slot is booked', AppointmentForSlot });
        } else {
            return res
                .status(200)
                .json({ success: false, message: 'Selected sot is already booked' });
        }
    } catch (error) {
        console.error(" ERROR:", error);

        return res.status(400).json({
            success: false,
            message: "Error  ",
            error: error.message,
            stack: error.stack
        });
    }
};

const GetUserData = async (req, res) => {
    try {
        const _id = req._id;

        if (_id) {
            const user = await User.findById(_id);
            const data = {
                name: user.name,
                email: user.email,

            };
            if (user) {
                res
                    .status(200)
                    .json({ success: true, message: 'Here is users data', data });
            } else {
                res.status(401).json({
                    subtle: false,
                    message: 'User not found ',
                });
            }
        }
        else {
            return res.status(401).json({
                success: true,
                message: "Unauthorized access"
            })
        }
    } catch (error) {
        console.error(" ERROR:", error);

        return res.status(400).json({
            success: false,
            message: "Error ",
            error: error.message,
            stack: error.stack
        });
    }
};


const GetProfileData = async (req, res) => {
    try {
        const _id = req._id;
        if (_id) {
            const user = User.findById({ _id });
            if (user) {
                return res.status(200).json({
                    success: true,
                    userData: user
                })
            }
            else {
                return res.status(401).json({
                    success: true,
                    message: "User profile not found"
                })
            }
        }
        else {
            return res.status(401).json({
                success: true,
                message: "Unauthorized access"
            })
        }


    } catch (error) {
        console.error(" ERROR:", error);

        return res.status(400).json({
            success: false,
            message: "Error ",
            error: error.message,
            stack: error.stack
        });
    }
}

const EditUserProfile = async (req, res) => {
    try {
        const { fullname, phone, dob, gender } = req.body;
        const _id = req._id;

        if (!fullname || !phone || !dob || !gender) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (!_id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        const user = await User.findByIdAndUpdate(
            _id,
            {
                fullname,
                phone,
                dob,
                gender
            },
            {
                new: true,          
                runValidators: true 
            }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const EditUserAddress = async (req, res) => {
    try {
        const _id = req._id;
        const { street, city, state, pincode, country } = req.body;

        if (!_id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        const user = await User.findByIdAndUpdate(
            _id,
            {
                $set: {
                    "address.street": street,
                    "address.city": city,
                    "address.state": state,
                    "address.country": country,
                    "address.pincode": pincode
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            user
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


module.exports = {
    RegisterUser,
    HashPassword,
    LoginUser,
    GetDctorList,
    GetDoctor,
    GetAvailabilitySlotsForUser,
    BookSlot,
    GetUserData,
    GetProfileData,
    EditUserAddress,
    EditUserProfile
};
