import Subscribers from "../models/subscriberModel.js"
import { sendMail } from "../notifications/nodemailer.js";
//function to send notification to all subscribers.
export const getAllSubs = async (req, res) => {
    const subArray = await Subscribers.findOne();
     const msg = `<h2> We have new blog by ${'sachin'}.</h2>
    <p1>Topic:${'emerging technology'}.`
    subArray.subscribers.map((subscriber) => {
        sendMail(subscriber,"Blog_Post",msg);
      })
    
    return res.status(200).json();
}
//function to add new subscriber into database.
export const newSubs = async (req, res) => {
    try {
        const subs = await Subscribers.findOne();
        const user = req.body.email;
        console.log(user)
        const exists = subs.subscribers.filter((subEmail) => {
            return subEmail == user
        })
        if (exists.length != 0) {
            return res.status(400).json({ status:'failed',msg:"Provide unique email." });
        }
        subs.subscribers.push(user);
        const result = await subs.save();
        console.log(result);
        return res.status(200).json({status:'success',msg:'You subscribed us successfuly.'});
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ status: 'Error.' ,msg:'server side error.'})
    }
}