import { createContext, useContext, useState } from "react";
import { ToastProvider } from "./ToastContext";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(sessionStorage.getItem("userRole"));
    const baseURL = "https://class-sync-pi.vercel.app";

    const [email, setEmail] = useState(null);
    const addEmail = (emailId) => {
      setEmail(emailId);
      sessionStorage.setItem("emailId", emailId);
    };
    const storeValues = (role) => {
      sessionStorage.setItem("userRole", role);
      setUserRole(role);
    };

    const [token, setToken] = useState(localStorage.getItem("token"));
    const storeToken = (token) => {
      sessionStorage.setItem("token", token);
      setToken(token);
    };
    const LogoutUser = () => {
      setUserRole("");
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("projectCode");
      sessionStorage.removeItem("emailId");
      sessionStorage.removeItem("token");
      setToken(null);
    };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{
        userRole,
        email,
        addEmail,
        storeValues,
        storeToken,
        LogoutUser,
        baseURL,
        isLoggedIn,
        token,
      }}
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
