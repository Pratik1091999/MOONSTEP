// Register Page Api 4
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
                        sendOTPMail(email);
                        res.status(200).send("User Register sucessfully");
                    })
                        .catch((e) => {
                            console.log(e)
                            res.send("Your Email or Phone Number is Already Register")
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