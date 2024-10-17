const mongoose = require("mongoose");
const uri = process.env.URI


const connectDB = async () => {
  try {
    await mongoose.connect(uri || "mongodb+srv://admin:admin@folowers.cu0l9hg.mongodb.net/?retryWrites=true&w=majority&appName=folowers").then(() => console.log("Connected to MongoDB using Mongoose!")).catch(err => console.log("Error connecting"))
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;



