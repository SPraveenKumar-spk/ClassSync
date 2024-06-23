import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  const storeValues = (serverToken, role) => {
    localStorage.setItem("token", serverToken);
    localStorage.setItem("userRole", role);
    setToken(serverToken);
    setUserRole(role);
  };

  const LogoutUser = () => {
    setToken('');
    setUserRole('');
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
  };

  return (
    <AuthContext.Provider value={{token, userRole, storeValues, LogoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const contextValue = useContext(AuthContext);
  if (!contextValue) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return contextValue;
};
