require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('./db/db');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/user.router');

const PORT = process.env.PORT;

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(userRouter);


app.listen(PORT, (req, res) => {
  console.log('Server started', PORT);
  // req.json({ msg: "Express Server started and running in", PORT})
});
