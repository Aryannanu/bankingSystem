const mongoose = require("mongoose");
const validator = require("validator");

const userSchemas = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        minlength : 4,
        maxlength : 100
    },
    emailId : {
        type : String,
        required : true,
        lowercase : true,
        unique : true,
        trim : true,
        validate : {
            validator : validator.isEmail,
            message : "Please enter valid email!!"
        }
    },
    phoneNumber : {
        type : String,
        trim : true,
        validate : {
            validator : validator.isMobilePhone,
            message : "Please eneter valid mobile number !"
        }
    },
    gender : {
        type : String,
        enum : {
            values : ["male","female","others"],
            message : "Please enter valid gender"
        }
    },
    password : {
        type : String,
        validate : {
            validator : validator.isStrongPassword,
            message : "Your Password should have at least One Capital letter , one lowerCase letter and have a number and and have one special character and password should be of length 8 atleast"
        }
    }
},
{
    timestamps : true,
});

module.exports = mongoose.model("User",userSchemas);