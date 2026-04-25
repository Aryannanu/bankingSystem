const transactionServices = require("../services/transaction.service");

const createTransactionController = async (req, res) => {
    try {
        const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
        if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const result = await transactionServices.createTransactionService({
            fromAccount,
            toAccount,
            amount,
            idempotencyKey
        });
        if (!result) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong"
            });
        }
        return res.status(result.status).json({
            success: result.status < 400,
            message: result.message,
            transaction: result.transaction || null
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};


const createInitialFundsTransactionController = async (req, res) => {
    try {
        const result = await transactionServices.createInitialFundsTransactionService({
            toAccount: req.body.toAccount,
            amount: req.body.amount,
            idempotencyKey: req.body.idempotencyKey,
            userId: req.user._id
        });
        return res.status(result.status).json({
            message: result.message,
            transaction: result.transaction || null
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};



module.exports = {createTransactionController,createInitialFundsTransactionController};