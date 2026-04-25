const express = require('express');
const router = express.Router();
const userController = require("../controller/user.controller");


router.post(
  "/user/signUp",
  userController.registerUser
);

router.post("/user/login", userController.loginUser);


module.exports = router;