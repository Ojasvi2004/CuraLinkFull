const mongoose=require("mongoose");

const Addressmodel=new mongoose.Schema({
    street: {
        type: String,
        required: true,
      },
    city: {
        type: String,
        required: true,
      },
    zip:{
        type: Number,
        required: true,
      },
})

const Address=mongoose.model("Address",Addressmodel);

module.exports={Address,Addressmodel};