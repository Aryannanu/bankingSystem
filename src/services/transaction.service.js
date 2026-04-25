const mongoose = require("mongoose");
const Account = require("../models/account");
const Transaction = require("../models/transaction");
const Ledger = require("../models/ledger");

const createTransactionService = async ({ fromAccount, toAccount, amount, idempotencyKey }) => {
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return {
            status: 400,
            message: "FromAccount, toAccount, amount and idempotencyKey are required"
        };
    }

    const fromUserAccount = await Account.findOne({ _id: fromAccount });
    const toUserAccount = await Account.findOne({ _id: toAccount });
    if (!fromUserAccount || !toUserAccount) {
        return {
            status: 400,
            message: "Invalid fromAccount or toAccount"
        };
    }

    const isTransactionAlreadyExists = await Transaction.findOne({
        idempotencyKey: idempotencyKey
    });
    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return {
                status: 200,
                message: "Transaction already processed",
                transaction: isTransactionAlreadyExists
            };
        }
        if (isTransactionAlreadyExists.status === "PENDING") {
            return {
                status: 200,
                message: "Transaction is still processing",
            };
        }
        if (isTransactionAlreadyExists.status === "FAILED") {
            return {
                status: 500,
                message: "Transaction processing failed, please retry"
            };
        }
        if (isTransactionAlreadyExists.status === "REVERSED") {
            return {
                status: 500,
                message: "Transaction was reversed, please retry"
            };
        }
    }
    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return {
            status: 400,
            message: "Both fromAccount and toAccount must be ACTIVE to process transaction"
        };
    }

    const balance = await fromUserAccount.getBalance();
    if (balance < amount) {
        return {
            status: 400,
            message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`
        };
    }
    let transaction;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        transaction = (await Transaction.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey: idempotencyKey,
            status: "PENDING"
        }], { session }))[0];

        await Ledger.create([{
            account: fromAccount,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session });

        await (() => {
            return new Promise((resolve) => setTimeout(resolve, 15 * 1000));
        })();

        await Ledger.create([{
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session });

        await Transaction.findOneAndUpdate(
            { _id: transaction._id },
            { status: "COMPLETED" },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return {
            status: 400,
            message: "Transaction is Pending due to some issue, please retry after sometime",
        };
    }
    return {
        status: 201,
        message: "Transaction completed successfully",
        transaction: transaction
    };
};

const createInitialFundsTransactionService = async ({toAccount,amount,idempotencyKey,userId}) => {
    if (!toAccount || !amount || !idempotencyKey) {
        return {
            status: 400,
            message: "toAccount, amount and idempotencyKey are required"
        };
    }
    const toUserAccount = await Account.findOne({
        _id: toAccount,
    });
    if (!toUserAccount) {
        return {
            status: 400,
            message: "Invalid toAccount"
        };
    }
    const fromUserAccount = await Account.findOne({
        user: userId
    });
    if (!fromUserAccount) {
        return {
            status: 400,
            message: "System user account not found"
        };
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const transaction = (await Transaction.create([{
            fromAccount: fromUserAccount._id,
            toAccount,
            amount,
            idempotencyKey: idempotencyKey,
            status: "PENDING"
        }], { session }))[0];

        await Ledger.create([{
            account: fromUserAccount._id,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session });

        await Ledger.create([{
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session });

        transaction.status = "COMPLETED";
        await transaction.save({ session });
        await session.commitTransaction();
        session.endSession();
        return {
            status: 201,
            message: "Initial funds transaction completed successfully",
            transaction: transaction
        };
    } catch (error) {
        console.log("error",error);
        await session.abortTransaction();
        session.endSession();
        return {
            status: 500,
            message: "Transaction failed, please retry"
        };
    }
};





module.exports = {
    createTransactionService,
    createInitialFundsTransactionService
};