require("dotenv").config()
const express = require("express")
const app = express()

// Setup your Middleware and API Router here
const morgan = require("morgan")
app.use(morgan('dev'))

const cors = require('cors')
app.use(cors())

const client = require("./db/client")
client.connect()

app.use(express.json())
app.use("/", require("./api"));

app.get("/",(req,res)=>{
  res.send("hello")
})

app.get("*",(req,res)=>{
  res.status(404).send("error")
})

module.exports = app;