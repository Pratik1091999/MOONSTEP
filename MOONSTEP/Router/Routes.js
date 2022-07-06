const express = require('express');
const router = express.Router();
const userController = require("../controller/userControler");


//Home Page 
router.get('/HomePage', userController.HomePage);

//Register Page 
router.post('/Register', userController.Register);

//Login Page 
router.post('/Login', userController.login);

// OTP verify
router.post('/verfiy/:email', userController.OTPVerfiy);

//Resend OTP  Page
router.post('/resend/:email', userController.resendOTP);

//Forget Password Page 
router.post('/Forget', userController.Forget_Password);

//Reset Password Page 
router.post('/resetPassword/:email', userController.Reset_Password);


//Change  Password Page 
router.post('/changePassword', userController.change_Password);
router.post('/changePasswordVerify', userController.change_Password_Verfiy);


module.exports = router;
