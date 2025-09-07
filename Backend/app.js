const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const gallerieRouts = require('./routes/galleries-routs');
const userRouts = require('./routes/user-routs');
const errorController = require('./controllers/error-controller');

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/galleries', gallerieRouts);
app.use('/api/users', userRouts);

app.use(errorController);

const port = process.env.PORT || 5000;

mongoose
  .connect(
    `mongodb+srv://godabreli:${process.env.MONGODB_PASSWORD}@cluster0.cxisa.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    app.listen(port);
    console.log('app Listening on port ' + port);
  })
  .catch((err) => {
    console.log(err);
  });
