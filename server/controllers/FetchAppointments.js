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

const FetchAllAppointmentsForDoctors=async(req,res)=>{

    try {
        const _id=req._id;
        const AllSchedule=await Appointment.find({doctorId:_id});

        return res.status(200).json({success:true,message:"Here are allPastAndFutureAppointments",AllSchedule});


        
    } catch (error) {
        return res.status(403).json({
            success:false,message:`${error}`
        });
        
    }
}

const FetchTodaysAppointmentForDoctors=async (req,res) =>
{
    try {

        const {dateISO}=req.body;
                        
        const doctor_id=req._id;

        const DayAppointment=await Appointment.find({date:dateISO,doctorId:doctor_id});

        res.status(200).json({success:true,message:"Todays Appointment are.",DayAppointment});
        
    } catch (error) {

         return res.status(403).json({
            success:false,message:`${error}`
        });
        
    }    
}

const handleAppointmentStatusAtLiveQueue=async (req,res) => 
{
  try {
    const {id,newstatus}=req.body;
      if (!id || !newstatus) {
      return res.status(400).json({
        success: false,
        message: "Missing appointment ID or new status"
      });
    }

    const ThatAppointment= await Appointment.findById(id);

    if (ThatAppointment) 
    {
        ThatAppointment.status=newstatus;

        await ThatAppointment.save();
        res.status(200).json({success:true,message:"Appointment Updated",UpdatedAppointment:ThatAppointment});

    }
    else{
        res.status(403).json({success:false,message:"Appointment object not found"});
    }
    
  } catch (error) {
    res.status(500).json({success:false,message:`Some error occurres ${error}`});
  }  
}

module.exports={FetchAppointmentsForPatient,FetchAllAppointmentsForDoctors,FetchTodaysAppointmentForDoctors,handleAppointmentStatusAtLiveQueue}