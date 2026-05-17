// src/context/AuthContext.jsx

import { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const login = (token) => {

    localStorage.setItem("token", token);

    setUser(token);
  };

  const logout = () => {

    localStorage.removeItem("token");

    setUser(null);

    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;