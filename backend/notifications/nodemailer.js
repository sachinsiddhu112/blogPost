import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()
console.log(JSON.stringify(process.env.APP_PASS))
const password = JSON.stringify(process.env.APP_PASS)
const transporter = nodemailer.createTransport
    ({
        host: 'smtp.gmail.com',
        port: 465,
        auth:
        {
            user: 'sachinsiddhu112@gmail.com',
            pass: "mofsveerkfkwabgd"
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