const express = require("express");
const app = express();
require('./DataBase/dbConnection');
require('./Model/registerSchema')



app.use(express.json());

//routes url
app.use('/user', require('./Router/Routes'));


//PORT
const port = process.env.PORT || 4000;
//server 
app.listen(port,()=>{
    console.log(` Port run at localhost ${port}`);
});
