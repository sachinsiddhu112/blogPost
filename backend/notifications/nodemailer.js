import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()

const PASSWORD = JSON.stringify(process.env.APP_PASS);
const USER = JSON.stringify(process.env.NOTIFICATION_USER);
const HOST = JSON.stringify(process.env.NOTIFICATION_HOST);
const transporter = nodemailer.createTransport
    ({
        host: HOST,
        port: 465,
        auth:
        {
            user: USER,
            pass: PASSWORD
        }
    })
export const sendMail = (to, sub, msg) => {
    transporter.sendMail
        ({
            to: to,
            subject: sub,
            html: msg
        })
}