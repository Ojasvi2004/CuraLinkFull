import { useEffect, createContext, useState } from "react";
import axios from "axios";

const server = import.meta.env.VITE_SERVER;

export const AuthContext = createContext();
// Alias export so lowercase imports also work without breaking
export const Authcontext = AuthContext;

export const AuthProvider = ({ children }) => {
  const [token, settoken] = useState(() => localStorage.getItem("token") || null);
  const [user, setuser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const getUserData = async (currentToken) => {
    if (!currentToken) {
      setuser(null);
      return;
    }

    try {
      const response = await axios.get(`${server}/api/user/getUserData`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (response.data.success) {
        setuser(response.data.data);
        localStorage.setItem("user", JSON.stringify(response.data.data));
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
    setuser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      getUserData(token);
    } else {
      logout();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, settoken, user, setuser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default Authcontext;