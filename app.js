require("dotenv").config()
const express = require("express")
const app = express()
const cors = require('cors')
app.use(cors())

// Setup your Middleware and API Router here
// require('dotenv').config();
// const { PORT = 3000 } = process.env;
// const express = require('express');
const server = express();
const bodyParser = require('body-parser');
server.use(bodyParser.json());

const morgan = require('morgan');
server.use(morgan('dev'));

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");
  next();
});

// const apiRouter = require('./api');
// server.use('/api', apiRouter);
// const { client } = require('./db');
// client.connect();
// server.listen(PORT, () => {
//   console.log("The server is up on port", PORT);
// });


module.exports = app;
