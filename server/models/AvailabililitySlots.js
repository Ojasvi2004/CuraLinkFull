const mongoose=require('mongoose');

const AvailabiitySlotSchema= new mongoose.Schema({

    slotId:{
        type:String,
        required:true
    },
    Date:{
        type:Date,
        required:true,
    },
    Time:{    
        Start:{
            type:String,
            required:true,
        },
        End:{
            type:String,
            required:true,
        },
    },
    type:{
        type:String,
        required:true,
    },
    isBooked:{
        type:Boolean,

    },
    patientId:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
    },
    doctorId:{
        type:mongoose.Schema.ObjectId,
        ref:'Doctor',
        required:true,
    },
    clinicId:{
        type: mongoose.Schema.Types.Mixed,
        ref:'Clinic',
        required:true,
    }

})

const AvailabiitySlot=new mongoose.model("AvailabilitySlots",AvailabiitySlotSchema);

module.exports=AvailabiitySlot;