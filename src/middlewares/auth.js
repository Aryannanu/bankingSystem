const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Sorry you are not logged in");
        }
        const decoded = jwt.verify(token, "SECRET_KEY");
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).send("User does not exist");
        }
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).send("Invalid or expired token");
    }
};

module.exports = userAuth;