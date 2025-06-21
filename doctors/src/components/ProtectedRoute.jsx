import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate } from "react-router-dom";



const ProtectedRouteForDoctors=({children})=>{

    const {token}=useContext(AuthContext);

    if (!token) 
    {
        return <Navigate to='/doctor/login' replace ></Navigate>    
    }

    return children;
}

export default ProtectedRouteForDoctors;