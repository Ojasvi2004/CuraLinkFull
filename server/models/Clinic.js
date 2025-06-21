const mongoose=require('mongoose');

const ClinicSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    clinicContact:{
        type:Number,
        required:true
    }
});


module.exports=ClinicSchema;