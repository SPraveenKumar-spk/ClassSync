import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setOut] = useState("");

  const localToken = (serverToken) => {
    setOut(serverToken);
    return localStorage.setItem("token", serverToken);
  };

  let isloggedin = !!token;

  const logoutUser = () => {
    setOut("");
    return localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isloggedin, localToken, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = () => {
  const authValue = useContext(AuthContext);

  if (!authValue) {
    throw new Error("AuthProvider is not available");
  }

  return authValue;
};
