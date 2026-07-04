import { useEffect } from "react";
import axios from 'axios'
import { createContext, Children, useState }  from "react"

const Authcontext=createContext();

const AuthProvider=({children})=>{

    const [token, settoken] = useState(() => localStorage.getItem('token') || null);
    const [user,setuser]=useState(()=> localStorage.getItem('user') || {});

    const getUserData= async()=>{
      try {
        const response=await axios.get("http://localhost:8000/api/user/getUserData",{
          headers:{
            Authorization:`Bearer ${token}`
          }
        }) 
        if (response.data.success) 
        {
        //    console.log(response.data.data);
          setuser(response.data.data);
        }
        
      } catch (error) {
       console.log(`Error in authContext: ${error}`);
      }
    }

     useEffect(() => {
      getUserData();
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    if(user)
    {
        localStorage.setItem("user",user);
    }
    else{
        localStorage.removeItem("user");
    }
  }, [token]);



    return(
        <Authcontext.Provider value={{token,settoken,user,setuser}}>
            {children}
        </Authcontext.Provider>
    )
}

export  {Authcontext,AuthProvider};