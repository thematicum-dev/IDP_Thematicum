var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var appRoutes = require('./routes/app');
var authRoutes = require('./routes/auth');
var accessCodeRoutes = require('./routes/accessCodes');
var testRoute = require('./routes/test');
var themeRoutes = require('./routes/themes');
var userInputRoutes = require('./routes/userThemeInputs');
var stockRoutes = require('./routes/stocks');

var app = express();
mongoose.connect('localhost:27017/thematicum');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/auth', authRoutes);
app.use('/api/accesscodes', accessCodeRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/userinputs', userInputRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/test', testRoute);
//app.use('/', appRoutes);

app.use(function (req, res, next) {
    return res.render('index');
});

//error handling
app.use(function (err, req, res, next) {
    console.log('Error handling middleware')
    return res.status(err.status || 500).json(err);
})

module.exports = app;
