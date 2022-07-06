const mongoose = require('mongoose');

//Database Connection
mongoose.connect("mongodb+srv://Pratik:Pratik123@cluster0.okioc.mongodb.net/MOONSTEP?retryWrites=true&w=majority").then(()=>{
    console.log("Database Connected")
}).catch((err)=>{
    console.log(`${err}`);
})
