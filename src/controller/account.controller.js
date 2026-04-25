const accountServices = require("../services/account.service");

const accountCreateController = async (req,res) => {
    const user = req.user;
    const account = await accountServices.createAccountService({
        user : user._id
    });
    res.status(201).json({
        account
    });
}

const getUserAccountsController = async (req, res) => {
    try {
        const user = req.user; 
        const accounts = await accountServices.getUserAccountsAervice({ user });
        res.status(200).json({
            success: true,
            data: accounts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getAccountBalanceController = async (req, res) => {
    try {
        const { accountId } = req.params;
        const user = req.user;
        const result = await accountServices.getAccountBalanceService(accountId, user);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {accountCreateController,getUserAccountsController,getAccountBalanceController};