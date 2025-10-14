const express=require('express');
const AvailabiitySlot = require('../models/AvailabililitySlots');
const { Appointment } = require('../models/Appointment');

const FetchAppointmentsForPatient=async (req,res) => 
{
    try {

        const _id=req._id;

        const allSchedule= await Appointment.find({});

        const MyScheduleArray=allSchedule.filter((slot)=>String(slot.patientId)===String(_id));

      
        
        return res.status(200).json({success:true,message:"Here are allPastAndFutureAppointments",MyScheduleArray})
        
    } catch (error) {
        return res.status(403).json({
            success:false,message:`${error}`
        })
    }
}

module.exports={FetchAppointmentsForPatient}