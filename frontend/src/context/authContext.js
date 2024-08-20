import { createContext, useState } from "react";

export const authContext = createContext();


export const AuthProvider = ({ children }) => {

    const [user,setUser] = useState(
        sessionStorage.getItem("user") ?JSON.parse(sessionStorage.getItem("user")) : ""
    )
    const [authToken,setAuthToken] = useState(
        sessionStorage.getItem('authToken')? JSON.parse(sessionStorage.getItem("authToken")):""
    )



    return <authContext.Provider value={{
        user,setUser,authToken,setAuthToken
    }}>

        {children}
    </authContext.Provider>
}