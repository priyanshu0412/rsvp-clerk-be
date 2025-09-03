const express = require("express")
const app = express()
require("dotenv").config()
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cors = require("cors")
const DBConnection = require("./db")

// Body Parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan("dev"))
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]
}))

// DB Connection 
DBConnection()

app.get("/", (req, res) => {
    res.status(200).send({ message: "First Route" })
})


const PORT = process.env.PORT | 3030

app.listen(PORT, () => {
    console.log(`Server started On localhost:${PORT}`)
})