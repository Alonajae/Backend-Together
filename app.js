require('dotenv').config();
require('./models/connection');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tripRouter = require('./routes/trips');
var safeplaceRouter = require('./routes/safeplaces');
var alertRouter = require('./routes/alerts');

var app = express();



const fileUpload = require('express-fileupload');
app.use(fileUpload());

const cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/trips', tripRouter);
app.use('/safeplaces', safeplaceRouter);
app.use('/alerts', alertRouter);

// Require and initialize the socket server
require('./socketServer');

module.exports = app;
