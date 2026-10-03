import { useEffect, createContext, useState } from "react";
import axios from "axios";

const server = import.meta.env.VITE_SERVER;

export const AuthContext = createContext();
// Alias export so lowercase imports also work without breaking
export const Authcontext = AuthContext;

export const AuthProvider = ({ children }) => {
  const [token, settoken] = useState(() => localStorage.getItem("doctorToken") || null);
  const [doctor, setdoctor] = useState(() => {
    try {
      const savedDoctor = localStorage.getItem("doctor");
      return savedDoctor ? JSON.parse(savedDoctor) : null;
    } catch {
      return null;
    }
  });

  const getDoctorData = async (currentToken) => {
    if (!currentToken) {
      setdoctor(null);
      return;
    }

    try {
      const response = await axios.get(`${server}/api/doctors/getDoctorData`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (response.data.success) {
        setdoctor(response.data.data);
        localStorage.setItem("doctor", JSON.stringify(response.data.data));
      } else {
        logout();
      }
    } catch (error) {
      console.log(`Error in authContext: ${error}`);
      logout();
    }
  };

  const logout = () => {
    settoken(null);
    setdoctor(null);
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctor");
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("doctorToken", token);
      getDoctorData(token);
    } else {
      logout();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, settoken, doctor, setdoctor, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default Authcontext;