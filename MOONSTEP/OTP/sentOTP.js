const optgenerator = require('otp-generator');




// OTP Genrate
const genOTP = ()=>{

    var getotp = optgenerator.generate(4, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    })
    return getotp;
}


module.exports=genOTP;
