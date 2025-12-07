import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config({path :'./.env'})

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, 
    port : process.env.SMTP_PORT, 
    secure : process.env.SMTP_SECURE, 
    auth : {
        user : `${process.env.SMTP_USER}`, 
        pass : `${process.env.SMTP_PASS}` 
    }
})

async function sendEmail({to, subject, text, html}) {
    const msg = {
        from : `"Royal Kitchen" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html
    }
    return transporter.sendMail(msg)
}

export { sendEmail }
