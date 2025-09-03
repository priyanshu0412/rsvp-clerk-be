const mongoose = require("mongoose")
require("dotenv").config()


const DBConnection = async () => {
    await mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log("DB Connected Successfully")
    }).catch((err) => {
        console.log("Error While Connecting DB", err)
    })
}

module.exports = DBConnection