import React, { useState, useMemo, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Clock4, RotateCcw, Search } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const SectionSearch = ({ value, onChange, placeholder }) => (
  <div className="flex items-center gap-2 mb-3 px-2 py-1 bg-slate-100 rounded-md">
    <Search size={18} className="text-slate-500" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-transparent outline-none text-sm text-slate-700"
    />
  </div>
);

const PatientCard = ({ appt, onMark }) => {

  // const onMark=(id,newStatus)=>{

  //   handleStatus(id,newStatus);

  // }
  const getBorder = (status) => {
    switch (status) {
      case "upcoming":
        return "border-blue-400";
      case "no_show":
        return "border-yellow-500";
      case "completed":
        return "border-green-500";
      case "cancelled":
        return "border-red-500";
      default:
        return "border-slate-300";
    }
  };

  const { token, settoken } = useContext(AuthContext);



  // Sample initial data
  // const initialAppointments = [
  //   {
  //     id: "a1",
  //     name: "Rohan Patel",
  //     time: "10:00 AM",
  //     token: "A001",
  //     status: "upcoming",
  //   }

  return (
    <motion.div
      layout
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-white border ${getBorder(
        appt.status
      )} rounded-xl shadow-sm p-3 flex justify-between items-center`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center font-semibold rounded-full shadow">
          {appt.name[0]}
        </div>
        <div>
          <p className="font-medium text-slate-800">{appt.name}</p>
          <p className="text-sm text-slate-500">{appt.time}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {appt.status === "upcoming" && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onMark(appt.id, "completed")}
              title="Mark Completed"
              className="text-green-500 hover:text-green-600"
            >
              <CheckCircle2 size={22} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onMark(appt.id, "no_show")}
              title="Patient Didn’t Come → HOLD"
              className="text-yellow-500 hover:text-yellow-600"
            >
              <Clock4 size={22} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onMark(appt.id, "cancelled")}
              title="Cancel Appointment"
              className="text-red-500 hover:text-red-600"
            >
              <XCircle size={22} />
            </motion.button>
          </>
        )}

        {appt.status === "no_show" && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMark(appt.id, "completed")}
            title="Patient Arrived → Completed"
            className="text-green-500 hover:text-green-600"
          >
            <CheckCircle2 size={22} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

const DoctorLiveQueuePage = () => {
  const { token, settoken } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const GetAppointments = async () => {
    try {
      const getISODate = (dateObj) => dateObj.toISOString().split("T")[0];
      const todayISO = getISODate(new Date()) + "T00:00:00.000+00:00";

      const response = await axios.post(
        "http://localhost:8000/api/doctors/gettodayAppointment",
        {
          dateISO: todayISO,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        const temp = response.data.DayAppointment.map((element) => ({
          id: element._id,
          name: element.patientName,
          time: element.time.start,
          tokenID: "a1",
          status: element.status,
        }));
        console.log(todayISO);
        console.log(response.data);
        setAppointments(temp);
      }
    } catch (error) {
      console.log(`${error}`);
    }
  };

  useEffect(() => {
    GetAppointments();
  }, []);

  const [search, setSearch] = useState({
    upcoming: "",
    no_show: "",
    completed: "",
    cancelled: "",
  });
      const handleStatus=async(id,newstatus)=>{
    try {
      const response=await axios.post("http://localhost:8000/api/doctors/handleAppointment",{
          id,
          newstatus
      },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });

      if (response.data.success) 
      {
        console.log(response.data.UpdatedAppointment) ;
      }
      
    } catch (error) {
       console.log(`${error}`);
    }
  }

  const handleMark = async (id, newStatus) => {
    await handleStatus(id,newStatus);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const getFiltered = (status) =>
    appointments.filter(
      (a) =>
        a.status === status &&
        a.name.toLowerCase().includes(search[status].toLowerCase())
    );



  const sections = [
    { key: "upcoming", label: "UPCOMING", color: "blue-600" },
    { key: "no_show", label: "HOLD", color: "yellow-600" },
    { key: "completed", label: "COMPLETED", color: "green-600" },
    { key: "cancelled", label: "CANCELLED", color: "red-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-stone-200 p-6">
      <motion.div
        className="container mx-auto max-w-7xl"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
      >
        <h1 className="text-2xl font-bold text-blue-500 mb-6 text-center">
          Doctor Live Queue
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
          {sections.map((sec) => (
            <section
              key={sec.key}
              className="flex flex-col border-1 bg-white p-2  border-white shadow-2xl rounded-2xl"
            >
              <h2
                className={`text-lg font-semibold mb-2 text-center text-${sec.color}`}
              >
                {sec.label}
              </h2>
              <SectionSearch
                value={search[sec.key]}
                onChange={(val) => setSearch({ ...search, [sec.key]: val })}
                placeholder={`Search ${sec.label.toLowerCase()}...`}
              />
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[65vh] px-1">
                <AnimatePresence>
                  {getFiltered(sec.key).length > 0 ? (
                    getFiltered(sec.key).map((a, idx) => (
                      <PatientCard
                        key={`${a.id}`}
                        appt={a}
                        onMark={handleMark}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 text-center">
                      No patients.
                    </p>
                  )}
                </AnimatePresence>
              </div>
            </section>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorLiveQueuePage;
