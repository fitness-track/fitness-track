require("dotenv").config()
const express = require("express")
const app = express()

const fourOhFour = {
  name: '404Error',
  message: 'This path does not exist'
}

// Setup your Middleware and API Router here
const morgan = require("morgan")
app.use(morgan('dev'))

const cors = require('cors')
app.use(cors())

app.use(express.json())
app.use("/api", require("./api"));

const client = require("./db/client")
client.connect()

const apiRouter = require('./api');
app.use('/api', apiRouter);

app.get("/",(req,res)=>{
  res.send("hello1")
})

app.get("/api/unknown",(req,res)=>{
  res.status(404).send(fourOhFour)
})

module.exports = app;