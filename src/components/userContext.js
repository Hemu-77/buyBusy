import {  createContext, useState, useContext } from "react";
// import ChildComponent from "./ChildComponent";

export const UserContext = createContext();

export const UserProvider = ({children}) => {
   const[user, setUser] = useState(false);
   const[quantity, setQuantity] = useState(1)
   return(
    <UserContext.Provider value={{user, setUser, quantity, setQuantity}}>
        {children}
    </UserContext.Provider>
   )
}


export function useValue() {
    const value = useContext(UserContext);
    return value;
  }