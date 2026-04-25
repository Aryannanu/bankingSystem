const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://aryanyadavnanu_db_user:R5m0J47HT8jThLlx@ac-2n9pxwe-shard-00-00.krvhhys.mongodb.net:27017,ac-2n9pxwe-shard-00-01.krvhhys.mongodb.net:27017,ac-2n9pxwe-shard-00-02.krvhhys.mongodb.net:27017/bankingSystem?replicaSet=atlas-6x07mm-shard-0&ssl=true&authSource=admin");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = { connectDb}