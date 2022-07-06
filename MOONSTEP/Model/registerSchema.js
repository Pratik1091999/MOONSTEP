const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    Email: {
        type: String,
        require: true,
        unique: true
    },
    Phone_Number: {
        type: Number,
        require: true,
        unique: true
    },
    Password: {
        type: String,
        require: true,
        trim: true,
        // maxlength: 10
    },
    userVerfiy:{
        type:Boolean,
        default:false
    }
}, { timestamps: true });
const userInfo = mongoose.model("User", registerSchema);

module.exports = userInfo;