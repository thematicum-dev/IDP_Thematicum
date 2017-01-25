var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//routes
var authRoutes = require('./server/routes/auth.routes');
var themeRoutes = require('./server/routes/theme.routes');
var stockRoutes = require('./server/routes/stock.routes');
var themePropertiesRoutes = require('./server/routes/themeProperties.routes');
var stockAllocationRoutes = require('./server/routes/stockAllocations.routes');
var adminRoutes = require('./server/routes/admin.routes');

var app = express();
let mongodbPath = 'mongodb://admin:ru!#05#2Gud4Bndj@ds129179.mlab.com:29179/thematicum-test';
let mongodbPathDev = 'localhost:27017/thematicum';
mongoose.connect(mongodbPath);

// view engine setup
app.set('views', path.join(__dirname, './server/views'));
app.set('view engine', 'hbs');

//uncomment after placing your favicon in /public
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

app.use('/api/auth', authRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/themeproperties/', themePropertiesRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/stockallocations', stockAllocationRoutes);
app.use('/api/admin', adminRoutes);

app.route('/', function (req, res, next) {
    return res.render('index');
});

//error handling
app.use(function (err, req, res, next) {
    console.log('Error handling middleware', JSON.stringify(err))
    return res.status(err.status || 500).json(err);
});

module.exports = app;