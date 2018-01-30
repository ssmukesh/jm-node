var express = require('express');
//morgan records each request, can log requests to a file
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
//Express 4.x layout and partial template functions for EJS template engine
var engine = require('ejs-mate');
var session = require('express-session');

var app = express();

//write log to 'access.log' under the same directory
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' });

// view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.json());
//extended: true means parsing URL-encoded data with qs library(can parse json-like data), default value is true; false means using querystring library
app.use(bodyParser.urlencoded({ extended: false }));
//ejs-mate as web render engine
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({ resave: false, saveUninitialized: false, secret: 'JMAccounting' }));

//add these routes, it works once receive url request
var userRoutes = require('./routes/user');
var helperRoutes = require('./routes/helper');
var quickbooksRoutes = require('./routes/quickbooks');

app.use(userRoutes);
app.use("/api/user", userRoutes);
app.use("/api/helper", helperRoutes);
app.use("/api/quickbooks", quickbooksRoutes);

app.get('/', (req, res) => res.render('user/login'));
app.get('/signout', (req, res) => res.render('user/signout'));
app.get('/resident/home', (req, res) => res.render('quickbooks/home'));

module.exports = app;
