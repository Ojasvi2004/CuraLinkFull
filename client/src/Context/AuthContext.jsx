import { useEffect } from "react";
import { createContext, Children, useState }  from "react"

const Authcontext=createContext();

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
        <Authcontext.Provider value={{token,settoken}}>
            {children}
        </Authcontext.Provider>
    )
}

export  {Authcontext,AuthProvider};