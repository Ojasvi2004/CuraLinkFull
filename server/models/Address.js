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
  zip: {
    type: Number,
    default: null,
  },
});

module.exports = {
  Addressmodel,
};