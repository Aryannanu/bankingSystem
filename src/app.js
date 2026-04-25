const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const {connectDb} = require("./config/database.js");
const userRouter = require("./routes/user.route");
app.use(userRouter);
const accountRouter = require("./routes/account.route");
app.use(accountRouter);
const transactionRouter = require("./routes/transaction.route");
app.use(transactionRouter);


app.get("/", (req,res) => {
  res.send("Hello World");
});

app.get("/api", (req, res) => {
    res.send("This is the products endpoint");
});



connectDb().then(() => {
    console.log("Database connected successfully");
    app.listen(5003, () => {
           console.log("Server is running on port 5003");
});
}).catch((error) => {
    console.error("Database connection failed:", error);
});