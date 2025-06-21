require("dotenv").config();
const express=require("express");
const cors=require('cors');
const  UserRoute  = require("./routes/UserRoute");
const connectDB = require("./config/mongoConfig");
const DoctorRoute = require("./routes/DoctorRoute");
const app=express();



const port=process.env.PORT || 5000
connectDB();

app.use(cors({
   
    methods:["GET","PUT","POST"],
    credentials:true
}));

app.use(express.json());

app.use("/api/user",UserRoute);
app.use("/api/doctors",DoctorRoute);

app.get('/',(req,res)=>{
    res.send("hello");
});

app.listen(port,()=>{

   
    console.log(`Server running on port http://localhost:${port}/`);
   
});


