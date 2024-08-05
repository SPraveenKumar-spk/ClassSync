import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(sessionStorage.getItem("userRole"));
  // const baseURL = "https://class-sync-geht.vercel.app";
  // const baseURL = "https://class-sync-2hir.vercel.app";
  const baseURL = "http://localhost:5000";
  
  const storeValues = (role) => {
    sessionStorage.setItem("userRole", role);
    setUserRole(role);
  };

  const LogoutUser = () => {
    setUserRole('');
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("projectCode");
  };


  return (
    <AuthContext.Provider value={{ userRole, storeValues, LogoutUser,baseURL }}>
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