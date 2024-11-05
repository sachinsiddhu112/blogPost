
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { oauth2client } from "../utils/googleConfig.js";
import User from "../models/authModel.js";
//signup function
export const Signup = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    try {//checking these inputs provided or not.
        if (!username || !email || !password || !confirmPassword) {
            res.status(401).json({ error: "Provide Your Credintials" });
            return;
        }
        if (password != confirmPassword) {//checking password and confirm password are same or not.
            res.status(401).json({ error: "Password and Confirm Password are not matching" });
            return;
        }//finding if there is already user with same username or email.
        const user = await User.findOne({
            $or: [
                { username: username }
            ]
        });//if it exist return with 401.
        if (user) {
            res.status(401).json({ error: "Username  already exist" });
            return;
        }
        //password encryption.
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const newUser = await User.create({
            username: username,
            email: email,
            password: hash
        })
        const data = {
            user: {
                id: newUser._id
            }
        }
        const authToken = jwt.sign(data, process.env.JWT_SECRET);//creating authToken with jwt.
        const response = await newUser.save();
        res.status(200).json({ response, authToken });//sending authToken and response.
    }
    catch (error) {
        console.log("server error", error);
        res.status(500).json({ error: "Error on server side." });
    }
    return;

}

//login function.
export const Login = async (req, res) => {
    const { username, password } = req.body;//taking out username and password .
    try {
        if (!username || !password) {
            res.status(401).json({ error: "Provide username and password to login" });
            return;
        }
        const user = await User.findOne({ username: username });

        if (!user) {//if user doesn't exist.
            res.status(401).json({ error: "User doesn't exist,Sign up first" });
            return;
        }
        //comparing the provided password and saved password.
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: "Wrong password" });
            return;
        }
        const data = {
            user: {
                id: user._id
            }
        }
        const authToken = jwt.sign(data, process.env.JWT_SECRET);//sending response and authToken.
        res.status(200).json({ authToken, user });

    }
    catch (error) {
        console.log("login error", error);
        res.status(500).json({ error: "Error on server side." })
    }
}

const getUserDetails = async (token) => {
    try{
        const response = await fetch("https://api.github.com/user", {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
        }
    })
    const userData = await response.json();
    const user = {
        username: userData.login + userData.id,
        email: userData.email,
        password: null
    }
    //whenever user 
    const existingUser = await User.findOne({
        $or: [
            { username: user.username }
        ]
    });
    //user is trying to log in with github
    if (existingUser) {
        console.log('existingUser', existingUser)
        const data =
        {
            user:
            {
                id: existingUser._id
            }
        }
        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        return { authToken, result : existingUser };

    }
    //user is trying to sign up with github.
    const newUser = await User.create(user)
    const data = {
        user: {
            id: newUser._id
        }
    }
    const authToken = jwt.sign(data, process.env.JWT_SECRET);//creating authToken with jwt.
    const result = await newUser.save();
    return { result, authToken };}

    catch(err){
        console.log(err);
        return {error:err}
    }

}

export const loginWithGithub = async (req, res) => {
    const code = req.query.code;
    console.log(code);
    try {
        const response = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code,
            }),
        });
        const data = await response.json();
        if (data.error) {
            console.error("GitHub OAuth Error:", data.error);
            return res.status(500).json({error:'Server Side Error.'});
        }
        const userData = await getUserDetails(data.access_token);
        //if some error happend in fetching access token and user details.
        if(userData.error){
            return res.status(500).json({error:'Server Side Error'});
        }
        return res.status(200).json(userData)
        // Use the access token for further GitHub API requests
    } catch (error) {
        console.error("Error exchanging code for token:", error);
        return res.status(500).json({error:"Server Side Error."})
    }
}


export const loginWithGoogle = async (req, res) => {

  try{
   const { code } = req.query;
   console.log(code);
   const googleRes = await oauth2client.getToken(code);
   const ab = oauth2client.setCredentials(googleRes.tokens);
   const userDetails = await fetch("https://openidconnect.googleapis.com/v1/userinfo?alt=json&access_token=" + googleRes.tokens.access_token)
   const { name, email,sub } = await userDetails.json();
   const existingUser = await User.findOne({username:name+ sub.substring(0,5)});
   if(existingUser){
    console.log('existing user')
    const data =
        {
            user:
            {
                id: existingUser._id
            }
        }
        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        return  res.status(200).json({
            user:existingUser,
            authToken:authToken
        })
   }
   console.log('user not exist')
   const user ={
    username: name + sub.substring(0,5),
    email:email,
    password:null
   }
   const newUser = await User.create(user)
    const data = {
        user: {
            id: newUser._id
        }
    }
    const authToken = jwt.sign(data, process.env.JWT_SECRET);//creating authToken with jwt.
    const result = await newUser.save();
    return res.status(200).json({
        user:result,
        authToken:authToken
    })
  }
  catch(err){
    console.log(err)
  }
}