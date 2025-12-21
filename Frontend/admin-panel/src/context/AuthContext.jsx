import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(
        "http://localhost/EthioEvents/Backend/public/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!data.success) return data;

      // Store JWT
      setJwt(data.jwt);

      // Store user directly from login response
      setUser(data.user ?? null);

      return {
        success: true,
        user: data.user ?? null,
        jwt: data.jwt,
      };
    } catch (err) {
      if (err.response && err.response.data) {
        return err.response.data;
      }
      return { success: false, message: "Server error" };
    }
  };

  const logout = () => {
    setUser(null);
    setJwt(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        jwt,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
