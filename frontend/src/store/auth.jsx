import { createContext, useContext, useState } from "react";
import { ToastProvider } from "./ToastContext";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const baseURL = "http://localhost:5000";

  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [userName, setName] = useState(sessionStorage.getItem("name"));
  const storeToken = (token) => {
    sessionStorage.setItem("token", token);
    setToken(token);
  };

  const storeName = (name) => {
    sessionStorage.setItem("name", name);
    setName(name);
  };
  const LogoutUser = () => {
    sessionStorage.removeItem("projectCode");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("teamName");
    setToken(null);
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{
        userName,
        storeName,
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
