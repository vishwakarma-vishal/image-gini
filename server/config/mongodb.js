const mongoose = require("mongoose")
require('dotenv').config()

const connectDB = async () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("Database Connected")
        })
        .catch((err) => {
            console.log('error come during connect Database')
            console.error(err.message)
            process.exit(1)
        })
}

module.exports = connectDB;