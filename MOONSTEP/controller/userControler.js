const userInfo = require("../Model/registerSchema");
const OTPInfo = require("../Model/OTPSchema");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const sendOTPMail = require('../OTP/sendMail');
const genOTP = require('../OTP/sentOTP');

//Home Page Api 1
const HomePage = async (req, res) => {
    try {
        res.status(200).send("HOME PAGE");
    } catch (error) {
        res.status(400).send("Cant Load The Page");
    }
}


// Register Page Api 4,5
const Register = async (req, res) => {
    try {

        const emailregex = /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/;
        const phonenoregex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
        const passwordregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        const { email, phone_Number, password, confirm_Password } = req.body;

        if (!email == "" && !phone_Number == "" && !password == "" && !confirm_Password == "") {
            if (!emailregex.test(email)) {
                res.status(400).send("Your Email is not valid");
            } else if (!phonenoregex.test(phone_Number)) {
                res.status(400).send("Your phone no is not valid Please Enter Valid Phone number");
            }
            else if (!passwordregex.test(password)) {
                res.status(400).send("Please Enter password 8 characters long, One uppercase letter, one lowercase letter, one numeric value, One special character,not any blank space");
            }
            else {
                if (password == confirm_Password) {
                    let salt = await bcrypt.genSalt(10);
                    let hashPassword = await bcrypt.hash(confirm_Password, salt);
                    const addingUsersRecord = new userInfo({
                        Email: email,
                        Phone_Number: phone_Number,
                        Password: hashPassword
                    })
                    addingUsersRecord.save().then((data) => {
                        let OTP = genOTP()
                        sendOTPMail(email, "OTP verification", `Your OTP is ${OTP} only valid only valid for 1 min`)
                        let addingOTP = new OTPInfo({
                            Email: email,
                            userOTP: OTP
                        })
                        addingOTP.save().then(() => {
                            // res.status(200).send("OTP Send To Your Email")
                        })
                            .catch((e) => {
                                console.log(e)

                            })
                        res.status(200).send("User Register sucessfully");
                    }).catch((e) => {
                        res.status(200).send("Your Phone Number or email is already Register")
                    })

                } else {
                    res.send("Password And Confirm Password Not Match")
                }
            }
        } else {
            res.send("Please Enter All Field")
        }
    } catch (error) {
        res.status(400).send("User Not Register Please Try Again");
        console.log(error);
        res.send("Error")
    }

}


// Login Page Api 2,3
const login = async (req, res) => {

    const { password, email } = req.body;
    if (email && password) {
        let user = await userInfo.findOne({ Email: email });
        if (user) {
            let checkPassword = await bcrypt.compare(password, user.Password);
            if (checkPassword) {
                let token = jwt.sign({ userID: user._id }, process.env.Secret, { expiresIn: '15m' });
                res.json({ "message": "Login Succesfully", "Token valid for 15 Min": token, "userID": user._id, "userEmail": user.Email })
            } else {
                res.send("Enter valid  Password")
            }
        } else {
            res.send("Please Enter Valid Email Or Sign Up First for login")
        }

    } else {
        res.send("Please Enter Email ID and Password!")
    }
}


// OTP verfiy 6,7,8
const OTPVerfiy = async (req, res) => {
    const { email } = req.params;
    const { OTP } = req.body;
    if (email) {
        let user = await OTPInfo.findOne({ Email: email });
        if (user) {
            if (OTP == user.userOTP) {
                res.json("OTP verfiy");
                await OTPInfo.findOneAndDelete({ Email: email })
                await userInfo.findOneAndUpdate({ Email: email }), {
                    $set: {
                        userVerfiy: true
                    }
                }
            } else {
                res.send("Enter valid  OTP")
            }
        } else {
            res.send("OTP Exipre")
        }
    }
}


// resend OTP API With email 6,7,8,9,10,11,15
const resendOTP = async (req, res) => {
    const { email } = req.params;
    if (!email == "") {
        let user = await OTPInfo.findOne({ Email: email });
        if (!user) {
            let OTP = genOTP()
            const Subject = "Resent OTP ";
            let text = `Your resend OTP  is  ${OTP}  And only valid only valid for 1 min`;
            sendOTPMail(email, Subject, text)
            let addingOTP = new OTPInfo({
                Email: email,
                userOTP: OTP
            })
            addingOTP.save()
            res.status(200).send(" Resend OTP send SucessFully");
        } else {
            res.send(" For Resend OTP wait For 1 Min")
        }
    } else {
        res.send("Please Enter Email")
    }
}


//Forget Password 9,10,11
const Forget_Password = async (req, res) => {
    const { email } = req.body;
    if (!email == "") {
        let user = await userInfo.findOne({ Email: email });
        if (user) {
            let checkUserOTP = await OTPInfo.findOne({ Email: email });
            if (!checkUserOTP) {
                let OTP = genOTP()
                const Subject = "OTP verification For Forget Password";
                let text = `OTP for Forget Password is  ${OTP}  And only valid only valid for 1 min`;
                sendOTPMail(email, Subject, text)
                let addingOTP = new OTPInfo({
                    Email: email,
                    userOTP: OTP
                })
                addingOTP.save()
                res.status(200).send("OTP send SucessFully");
            } else {
                res.send("For Resend OTP wait For 1 Min")
            }
        } else {
            res.send("This Email is not exit in Database")
        }
    } else {
        res.send("Please Enter Email ")
    }

}


// Reset Password 12
const Reset_Password = async (req, res) => {
    const emailregex = /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/;
    const passwordregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    const { email } = req.params;
    const { newPassword, confirm_Password } = req.body;
    if (email == "" && newPassword == "" && confirm_Password == "") {
        res.status(400).send("Enter All Field")
    }
    else if (!emailregex.test(email)) {
        res.status(400).send("Your Email is not valid");
    }
    else if (!passwordregex.test(newPassword)) {
        res.status(400).send("Please Enter password 8 characters long, One uppercase letter, one lowercase letter, one numeric value, One special character,not any blank space");
    } else {
        let user = await userInfo.findOne({ Email: email });
        if (!user) {
            res.status(400).send("User is Not Register In Database")
        }
        else if (newPassword == confirm_Password) {
            let salt = await bcrypt.genSalt(10);
            let hashPassword = await bcrypt.hash(req.body.newPassword, salt)
            userInfo.findOneAndUpdate({ Email: email }, {
                $set: {
                    Password: hashPassword
                }
            })
                .then(result => {
                    res.status(200).send("Password Reset Successfully")
                })
                .catch(error => {
                    res.status(500).send(error)
                })
        } else {
            res.status(400).send("New Password And confirm Password Not Match")
        }
    }
}


// change Password Api 15
const change_Password = async (req, res) => {
    const { email } = req.body;
    if (!email == "") {
        let user = await userInfo.findOne({ Email: email });
        if (user) {
            let checkUserOTP = await OTPInfo.findOne({ Email: email });
            if (!checkUserOTP) {
                let OTP = genOTP()
                const Subject = "OTP verification For Change Password";
                let text = `OTP for Change Password is  ${OTP}  And only valid only valid for 1 min`;
                sendOTPMail(email, Subject, text)
                let addingOTP = new OTPInfo({
                    Email: email,
                    userOTP: OTP
                })
                addingOTP.save()
                res.status(200).send("OTP send SucessFully");
            } else {
                res.send("For Resend OTP wait For 1 Min")
            }
        } else {
            res.send("This Email is not exit in Database")
        }
    } else {
        res.send("Please Enter Email ")
    }
}

// change Password verify Api 15
const change_Password_Verfiy = async (req, res) => {
    const { email, OTP, newPassword } = req.body;
    const emailregex = /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/;
    const passwordregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (email == "" && OTP == "" && newPassword == "") {
        res.status(400).send("Enter All Field")
    }
    else if (!emailregex.test(email)) {
        res.status(400).send("Your Email is not valid");
    }
    else if (!passwordregex.test(newPassword)) {
        res.status(400).send("Please Enter password 8 characters long, One uppercase letter, one lowercase letter, one numeric value, One special character,not any blank space");
    } else {

        if (email) {
            let user = await OTPInfo.findOne({ Email: email });
            if (user) {
                if (OTP == user.userOTP) {
                    await OTPInfo.findOneAndDelete({ Email: email })
                    let salt = await bcrypt.genSalt(10);
                    let hashPassword = await bcrypt.hash(newPassword, salt)
                    userInfo.findOneAndUpdate({ Email: email }, {
                        $set: {
                            Password: hashPassword
                        }
                    })
                        .then(result => {
                            res.status(200).send("Password Change Successfully")
                        })
                        .catch(error => {
                            res.status(500).send(error)
                        })
                } else {
                    res.send("Enter valid  OTP")
                }
            } else {
                res.send("OTP Exipre")
            }
        }
    }
}



    module.exports = {
        Register,
        HomePage,
        login,
        OTPVerfiy,
        resendOTP,
        Forget_Password,
        Reset_Password,
        change_Password,
        change_Password_Verfiy
    };