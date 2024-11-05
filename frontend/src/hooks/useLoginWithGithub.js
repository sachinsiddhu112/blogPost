
import {useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { fetchUserDetailsFromGithub } from "../utils/authUtill"
import { authContext } from "../context/authContext"

export const useLoginWithGithub = () => {
const githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
const navigate = useNavigate();
const { setUser, setAuthToken } = useContext(authContext)
useEffect( () => {
    const userDetails =  async() => {
        const queryParams = new URLSearchParams(window.location.search);
        const paramValue = queryParams.get('code');
        if (paramValue && sessionStorage.getItem('authToken') == null) {
            const { user, authToken } = await fetchUserDetailsFromGithub(paramValue);
            setUser(user.username);//setting the user in auth context
            sessionStorage.setItem("user", JSON.stringify(user.username));//setting user in localStorage
            setAuthToken(authToken);//setting authToken in authContext
            sessionStorage.setItem('authToken', JSON.stringify(authToken));//settting authToken in localStorage. 
            navigate('/user-posts')
        }
    }
    userDetails();   
}, [])
const loginWithGithub = () => {
    window.location.assign("https://github.com/login/oauth/authorize?client_id=" + githubClientId)
}
return { loginWithGithub }
}