
import axios from 'axios';


const baseUrl = process.env.REACT_APP_HOST;

export const fetchUserDetailsFromGithub = async (codeParam) => {
    try {
        const response = await fetch(`${baseUrl}/auth/loginWithGithub?code=` + codeParam, {
            method: 'POST',
            headers:{
                "Content-Type":'application/json',
                "Accept":"application/json"
            }
        })
        const data = await response.json();
        const authToken = data.authToken;
        const user = data.result;
        return {authToken,user}
    }
    catch (err) {
        console.log(err);
        alert(err);
    }

};

export const fetchUserDetailsFromGoogle = async (code) => {
  try{
       const res = await fetch(`${baseUrl}/auth/loginWithGoogle?code=${code}`)
       const data = await res.json();
       return {status:'success',result:data }
  }
  catch(err){
    return {status:'Error',result:err}
  }
}

export const login = async ({username, password}) => {
    try {
        const response = await axios.post(`${baseUrl}/auth/login`, { username, password })
        const user = response.data.user
        const authToken = response.data.authToken
       return {user, authToken };
    }
    catch (error) {
        console.log("Error in login in", error);
        alert(error.response.data.error)
    }
}