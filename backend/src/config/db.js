require("dotenv").config();
const mongoose = require('mongoose');

const dbUrl = process.env.MONGODB_URL;

const ConnectToDB = async() => {

    try {
        const uri = dbUrl;
        if (!uri) {
            throw new Error("MongoDB URI not found in environment variables")
        }
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected!")
    } catch (error) {
        console.error("Database connection failed!", error);
        throw new Error
    }
}

module.exports = ConnectToDB;