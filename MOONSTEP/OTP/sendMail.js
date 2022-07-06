
const nodemailer = require('nodemailer');
const genOTP = require('./sentOTP');

const sendOTPMail = (email , Subject , text ) => {
    // const otp = genOTP();
    const transferemail = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "vaibhavamrale12@gmail.com",
            pass: "bswiozjvwlkcnmbd"
        }
        
    })

    const sendMailObj = {
        from: "vaibhavamrale12@gmail.com",
        to: email,
        subject: Subject ,
        text: text,

    }
    transferemail.sendMail(sendMailObj, (error) => {
        if (error) {
            console.log(error);
        } else {
        }
        
    });
    
}

module.exports=sendOTPMail;