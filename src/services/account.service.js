const Account = require("../models/account");


const createAccountService = async ({user}) => {
    const account = await Account.create({user});
    return account;
}


const getUserAccountsAervice = async({user}) => {
    const accounts = await Account.find({user});
    return accounts
}


const getAccountBalanceService = async (accountId, user) => {
    const account = await Account.findOne({
        _id: accountId,
        user: user._id 
    });
    if (!account) {
        return null;
    }
    const balance = await account.getBalance();
    return { account, balance };
};

module.exports = {createAccountService,getUserAccountsAervice,getAccountBalanceService };