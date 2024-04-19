import { createContext, useContext, useState } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({children})=>{

  const[token,setToken] = useState(localStorage.getItem("token"));
const storeToken = (serverToken)=>{
  localStorage.setItem("token",serverToken);
  // setToken(serverToken);
};

const LogoutUser = () =>{
  setToken('');
  localStorage.removeItem("token"); 
}



  return (
  <AuthContext.Provider value={{storeToken,LogoutUser}}>
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