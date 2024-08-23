import { createContext, useState } from "react";

export const authContext = createContext();//creaating the context for user.

//context porvider.
export const AuthProvider = ({ children }) => {
    const [user,setUser] = useState(
        //initializing the user variable .
        sessionStorage.getItem("user") ?JSON.parse(sessionStorage.getItem("user")) : ""
    )
    //initializing the authToken
    const [authToken,setAuthToken] = useState(
        sessionStorage.getItem('authToken')? JSON.parse(sessionStorage.getItem("authToken")):""
    )
    return <authContext.Provider value={{
        user,setUser,authToken,setAuthToken
    }}>

        {children}
    </authContext.Provider>
}