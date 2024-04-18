import { createContext, useContext } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({children})=>{
const storetoken = ({serverToken})=>{
  localStorage.setItem("token",serverToken);
};
  return (
  <AuthContext.Provider value={{storetoken}}>
    {children}
  </AuthContext.Provider>
  )
};

export const useAuth = ()=>{
  const contextValue = useContext(AuthContext);
  if(!contextValue){
    throw new console.error("Not found");
  }
  return contextValue;
}