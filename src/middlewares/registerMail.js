import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host : "bunnyTalk.com",
    auth : {
        user : '',
        pass : ''
    }
})