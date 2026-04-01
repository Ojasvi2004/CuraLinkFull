require("dotenv").config();
const express=require("express");
const cors=require('cors');
const  UserRoute  = require("./routes/UserRoute");
const connectDB = require("./config/mongoConfig");
const DoctorRoute = require("./routes/DoctorRoute");
const PrescriptionRoute = require("./routes/Prescriptionroutes");
const app=express();



const port=process.env.PORT || 5002
connectDB();

// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "http://192.168.1.2:5173",
//         "http://localhost:5174",
//     "http://192.168.1.2:5174"
//   ],
//   methods: ["GET","PUT","POST","DELETE"],
//   credentials: true
// }));


app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.use("/api/user",UserRoute);
app.use("/api/doctors",DoctorRoute);
app.use("/api/prescription",PrescriptionRoute);

app.get('/',(req,res)=>{
    res.send("hello");
});

app.listen(port,()=>{

   
    console.log(`Server running on port http://localhost:${port}/`);
   
});



