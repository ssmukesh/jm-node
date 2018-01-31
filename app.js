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
var cors = require('cors');

//write log to 'access.log' under the same directory
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' });

// view engine setup
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(morgan('combined', { stream: accessLogStream }));

app.get('/', (req, res) => res.render('user/login'));
app.get('/signout', (req, res) => res.render('user/signout'));
app.get('/resident/home', (req, res) => res.render('quickbooks/home'));
app.get('/resident/expenses', (req, res) => res.render('quickbooks/expenses'));
app.get('/resident/view', (req, res) => res.render('quickbooks/tenant-view'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ resave: false, saveUninitialized: false, secret: 'JMAWeb' }));
app.use(cors({ origin: true, credentials: true }));
app.options('*', cors());

module.exports = app;
