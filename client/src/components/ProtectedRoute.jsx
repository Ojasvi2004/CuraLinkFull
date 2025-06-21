import React,{useContext} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Authcontext } from "../Context/AuthContext";

const ProtectedRoute=({children})=>{

    const {token,settoken}=useContext(Authcontext);
    const navigate=useNavigate();

    if (!token) 
    {
      return <Navigate to='/login' replace ></Navigate>  
    }

    return children;
};

export default ProtectedRoute;