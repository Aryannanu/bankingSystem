const express = require('express');
const router = express.Router();
const transactionController = require("../controller/transaction.controller");
const userAuth = require("../middlewares/auth")

router.post("/transaction",userAuth, transactionController.createTransactionController);
router.post("/transaction/initial",userAuth, transactionController.createInitialFundsTransactionController);

module.exports = router;