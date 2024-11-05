import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useGoogleLogin } from "@react-oauth/google"
import { fetchUserDetailsFromGoogle } from "../utils/authUtill"
import { authContext } from "../context/authContext"
export const useLoginWithGoogl = () => {
    const navigate = useNavigate();
    const { setUser, setAuthToken } = useContext(authContext)
    const googleCodeResponse = async (authResult) => {
        try {
            const response = await fetchUserDetailsFromGoogle(authResult['code']);
            if (response.status == 'success') {
                const user = response.result.user;
                const token = response.result.authToken;
                setUser(user.username);
                setAuthToken(token);
                sessionStorage.setItem("user", JSON.stringify(user.username));//setting user in localStorage
                sessionStorage.setItem('authToken', JSON.stringify(token));//settting authToken in localStorage. 
                navigate('/user-posts')
            }
            else {
                console.log("erorr.")
                alert('Error, Retry after some time.')
            }
        }
        catch (err) {
            console.log(err);
            alert('Server Side Error.')
        }
    }
    const googleCodeError = () => {
        console.log('Error happend in getting code.')
        alert('Error,Retry after some time.')
    }
    const loginWithGoogle = useGoogleLogin({
        onSuccess: googleCodeResponse,
        onError: googleCodeError,
        flow: 'auth-code'
    })


    return { loginWithGoogle }
}