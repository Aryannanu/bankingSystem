const express = require('express');
const router = express.Router();
const accountController = require("../controller/account.controller");
const userAuth = require("../middlewares/auth")


router.post("/account/signUp",userAuth, accountController.accountCreateController);
router.get("/accounts", userAuth, accountController.getUserAccountsController);
router.get("/accounts/:accountId/balance", userAuth, accountController.getAccountBalanceController );




module.exports = router;