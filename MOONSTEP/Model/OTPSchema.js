const mongoose = require('mongoose');


let OTPchema = mongoose.Schema({
    Email:{
        type:String
    },
    userOTP:{
        type:String
    }
}, {timestamps: true});

OTPchema.index({createdAt: 1},{expireAfterSeconds: 60});
const OTPInfo = mongoose.model("OTP", OTPchema);

module.exports = OTPInfo;