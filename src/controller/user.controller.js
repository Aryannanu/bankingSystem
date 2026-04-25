const userServices = require("../services/user.service");
const jwt = require("jsonwebtoken");


const registerUser =async (req,res) => {
    try { 
        const name = req.body?.name;
        const emailId = req.body?.emailId;
        const phoneNumber = req.body?.phoneNumber;
        const gender = req.body?.gender;
        const password = req.body?.password;
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        const user = await userServices.registerUserServices({
            name,
            emailId,
            phoneNumber,
            gender,
            password
        });
        res.status(201).json({
            message : "User Registered Successfully",
            user
        });
    }catch (error) {
     console.error("ERROR:", error);
     res.status(500).json({
    message: error.message,
    stack: error.stack
  });
}
}

const loginUser = async (req,res) => {
    try{
        const {emailId,password} = req.body;
        const user = await userServices.loginUserServices({emailId,password});
        const token = jwt.sign({userId: user._id}, "SECRET_KEY", {expiresIn : "1h"});
        res.cookie("token", token, {
            httpOnly : true,
            secure: false,
            sameSite: "lax"
        });
        res.status(200).json({
            message : "User logged in successfully",
            user
        });
    }catch(error){
        console.log("Error in controller layer while logging in user",error);
        res.status(500).json({
            message : error.message,
            stack : error.stack
        });
    }
}



module.exports = {
    registerUser,
    loginUser
};
