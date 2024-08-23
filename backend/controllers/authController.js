
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

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
                { username: username },
                { email: email }
            ]
        });//if it exist return with 401.
        if (user) {
            res.status(401).json({ error: "Username or Email already exist" });
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