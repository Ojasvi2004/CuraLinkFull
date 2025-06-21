import { useState } from 'react'
import "./index.css"
import NavbarBeforeLogin from './components/NavbarBeforeLogin'
import { Routes ,Route,BrowserRouter} from 'react-router-dom'
import DoctorLandingPage from './pages/HomeFeatures'
import DoctorHowItWorksPage from './pages/DoctorHowItWorksPage'
import DoctorFaqPage from './pages/DoctorFaqPage'
import DoctorRegistrationPage from './pages/RegistrationPage'
import DoctorLoginPage from './pages/DoctorLoginPage'
import DoctorDashboardPage from './pages/DoctorDashboard'
import NavbarAfterLogin from './components/NavbarAfterLogin'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import DoctorAppointmentsPage from './pages/DoctorAppointmentsPage'
import DoctorMyPatientsPage from './pages/DoctorMyPatientsPage'
import DoctorLiveQueuePage from './DoctorLiveQueuePage'
import DoctorSetAvailabilityPage from './pages/DoctorSetAvailabilityPage'
import ProtectedRouteForDoctors from './components/ProtectedRoute'
import SettingsPage from './pages/ProfileSettings'





function App() {
  const [count, setCount] = useState(0);
  const {token,settoken}=useContext(AuthContext);

  return (    
    <>
     {
      token?
      <NavbarAfterLogin/>
      :
      <NavbarBeforeLogin/>
     }
    <Routes>
      <Route path='/doctor/features' element={<DoctorLandingPage/>}></Route>
      <Route path='/doctor/how-it-works' element={<DoctorHowItWorksPage/>}></Route>
      <Route path='/doctor/faq' element={<DoctorFaqPage/>}></Route>
      <Route path='/doctor/register' element={<DoctorRegistrationPage/>}></Route>
      <Route path='/doctor/login' element={<DoctorLoginPage/>}></Route>



      <Route  path='/doctor/dashboard' element={<ProtectedRouteForDoctors><DoctorDashboardPage/></ProtectedRouteForDoctors>} ></Route>
      <Route path='/doctor/appointments' element={<ProtectedRouteForDoctors><DoctorAppointmentsPage/></ProtectedRouteForDoctors>}></Route>
      <Route path='/doctor/patients' element={<ProtectedRouteForDoctors><DoctorMyPatientsPage/></ProtectedRouteForDoctors>} ></Route>
      <Route path='/doctor/queue-management' element={<ProtectedRouteForDoctors><DoctorLiveQueuePage/></ProtectedRouteForDoctors>} ></Route>
      <Route path='/doctor/availability' element={<ProtectedRouteForDoctors><DoctorSetAvailabilityPage/></ProtectedRouteForDoctors>} ></Route>
      <Route path='/doctor/settings' element={<ProtectedRouteForDoctors><SettingsPage/></ProtectedRouteForDoctors>} ></Route>
    </Routes>
   
     
    </>
  )
}

export default App
