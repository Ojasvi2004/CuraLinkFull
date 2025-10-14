import { useEffect } from 'react';
import {createContext,useState} from 'react';
import { useSearchParams } from 'react-router-dom';

const AuthContext=createContext();

const AuthProvider=({children})=>{
      const [token, settoken] = useState(() => localStorage.getItem('token') || null);
   
        useEffect(() => {
       if (token) {
         localStorage.setItem("token", token);
       } else {
         localStorage.removeItem("token");
       }
     }, [token]);


    return(
        <AuthContext.Provider value={{token,settoken}}>
            {children}
        </AuthContext.Provider>
    )
};

export {AuthContext,AuthProvider};