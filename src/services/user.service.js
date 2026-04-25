const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");


const registerUserServices = async ({name,emailId,phoneNumber,gender,password}) => {
    try{
        const hashPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name,
            emailId,
            phoneNumber,
            gender,
            password : hashPassword
        });
        return user;
    }catch(error){
        console.log("Error in service layer while registering user",error);
        throw error;
    }
}

const loginUserServices = async ({emailId,password}) => {
    try{
        const user = await User.findOne({emailId});
        if(!user){
            throw new Error("User not found with this emailId");
        }
        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            throw new Error("Invalid password");
        } 
        return user;
    }catch(error){
        console.log("Error in service layer while logging in user",error);
        throw error;
    }
}


module.exports = {
    registerUserServices,
    loginUserServices
};