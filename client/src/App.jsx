import React, { useContext } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import { Route,Router,Routes } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import Landing from './pages/Landing'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DoctorProfile from './pages/DoctorProfile'
import Doctor_List from './pages/Doctor_List'
import Contact from './pages/Contact'
import AboutUsPage from './pages/AboutUsPage'
import Team from './pages/Team'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'


import NavbarAfterLogin from './components/UserNavbar'
import { Authcontext } from './Context/AuthContext'
import Dashboard from './pages/Dashboard'
import FindDoctors from './pages/FindDoctors'
import Appointments from './pages/Appointments'
import AiAnalyzerPage from './pages/AI_analyzerPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'
import MyPrescriptionsPage from './pages/MyPrescriptions'
import PrescriptionDetailsPage from './pages/PrescriptionDetailsPage'
import MyHealthRecordsPage from './pages/MyHealthRecordPage'
import PatientMessagesPage from './pages/PatientMessagePage'



const App = () => {

  

  const {token}=useContext(Authcontext);
  return (
   <> 

   <BrowserRouter>
    <ScrollToTop /> 
    {
      token?

      <NavbarAfterLogin/>:
      <Navbar/>
     
    }
   <Routes>
    <Route path='/' element={<Landing/>} ></Route>
    <Route path='/login' element={<LoginPage/>}></Route>
    <Route path='/signup' element={<RegisterPage/>}></Route>
    <Route path='/contact' element={<Contact/>} ></Route>
    <Route path='/about' element={<AboutUsPage/>}></Route>
    <Route path='/team' element={<Team/>}></Route>
    <Route path='/see-more' element={<AboutUsPage/>}></Route>

    <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
    <Route path='/find-doctors' element={<ProtectedRoute><FindDoctors/></ProtectedRoute>}></Route>
    <Route path='/my-appointments' element={<ProtectedRoute><Appointments/></ProtectedRoute>}></Route>
    <Route path='/symptom-analyzer' element={<ProtectedRoute><AiAnalyzerPage/></ProtectedRoute>}></Route>
    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} ></Route>
    <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} ></Route>
    <Route path="/doctors/:doctorId" element={<ProtectedRoute><DoctorProfile /></ProtectedRoute>} />
    <Route path='/prescriptions' element={<ProtectedRoute><MyPrescriptionsPage/></ProtectedRoute>} ></Route>
    <Route path="/prescriptions/:prescriptionId" element={<ProtectedRoute><PrescriptionDetailsPage/></ProtectedRoute>} />
    <Route path='/health-records' element={<ProtectedRoute><MyHealthRecordsPage/></ProtectedRoute>} ></Route>
    <Route path='/messages' element={<ProtectedRoute><PatientMessagesPage/></ProtectedRoute>} ></Route>

    

    
    

   </Routes>
   <Footer/>
   </BrowserRouter>
   
   
   </>
  )
}

export default App
