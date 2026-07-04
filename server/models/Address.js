const mongoose = require("mongoose");

const Addressmodel = new mongoose.Schema({
  street: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  pincode: {
    type: Number,
    default: null,
  },
  country:{
    type:String,
    default:""
  },
  state:{
    type:String,
    default:""
  }
});

module.exports = {
  Addressmodel,
};