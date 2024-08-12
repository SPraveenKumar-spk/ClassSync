import { createContext, useContext, useState } from "react";
import { ToastProvider } from "./ToastContext";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(sessionStorage.getItem("userRole"));
  const baseURL = "http://localhost:5000";

  const storeValues = (role) => {
    sessionStorage.setItem("userRole", role);
    setUserRole(role);
  };

  const LogoutUser = () => {
    setUserRole("");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("projectCode");
  };

  function isUserLoggedIn() {
    const sessionCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("classsync_session="));
    return sessionCookie !== undefined;
  }

  const isLoggedIn = isUserLoggedIn();

  return (
    <AuthContext.Provider
      value={{ userRole, storeValues, LogoutUser, baseURL, isLoggedIn }}
    >
      <ToastProvider>{children}</ToastProvider>
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