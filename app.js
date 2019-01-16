import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import twitter from 'twitter';
import * as settings from './server/utilities/settings';


//routes
import authRoutes from './server/routes/auth.routes';
import themeRoutes from './server/routes/theme.routes';
import stockRoutes from './server/routes/stock.routes';
import themePropertiesRoutes from './server/routes/themeProperties.routes';
import stockAllocationRoutes from './server/routes/stockAllocations.routes';
import adminRoutes from './server/routes/admin.routes';
import activityRoutes from './server/routes/activity.routes';
import userRoutes from './server/routes/user.routes';
import userProfileRoutes from './server/routes/user-profile.routes';
import googleTrendRoutes from './server/routes/googleTrend.routes';
import newsFeedRoutes from './server/routes/newsFeed.routes';
import realtimeNews from './server/routes/googleNews.routes';
import customSearchScript from './server/routes/googleCustomSearchScript.routes';
import customSearch from './server/routes/googleCustomSearch.routes';
import stockPrice from './server/routes/stockPrice.routes';
import removeObsoleteURLs from './server/routes/removeObsoleteURLs.routes';
import fundRoutes from './server/routes/fund.routes'
import fundAllocationRoutes from './server/routes/fundAllocations.routes'

dotenv.config({path: "dot.env"});


const app = express();

const mongodbPath = settings.getDBConnectionString();
mongoose.connect(mongodbPath)
    .then(() => console.log('Connected to MongoDb'))
    .catch(error => console.log('Error connecting to MongoDb: ' + error));

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
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, PUT, DELETE, OPTIONS');
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/themeproperties/', themePropertiesRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/stockallocations', stockAllocationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', userProfileRoutes);
app.use('/api/googletrend',googleTrendRoutes);
app.use('/api/newsfeed',newsFeedRoutes);
app.use('/api/news', realtimeNews);
app.use('/api/customsearchscript', customSearchScript);
app.use('/api/customsearch', customSearch);
app.use('/api/stockprice', stockPrice);
app.use('/api/removeobsoleteurls', removeObsoleteURLs);
app.use('/api/funds', fundRoutes);
app.use('/api/fundallocations', fundAllocationRoutes);

app.use(function (req, res, next) {
    return res.render('index');
});

let schedule = require('node-schedule');
let reportsScript = require('./server/controllers/googleCustomSearchScript.controller');
let obsoleteLinkRemoval = require('./server/controllers/removeObsoleteURLs.controller');

let rule1 = new schedule.RecurrenceRule();
rule1.hour = 4;
rule1.minute = 0;
schedule.scheduleJob(rule1, function(){
    reportsScript.updateReports();
});

let rule2 = new schedule.RecurrenceRule();
rule2.hour = 1;
rule2.minute = 0;
schedule.scheduleJob(rule2, function(){
    obsoleteLinkRemoval.removeObsoleteURLsFromDB();
});



//error handling
//app.use(function (err, req, res, next) {
    //console.log('Error handling middleware', JSON.stringify(err))
    //return res.status(err.status || 500).json(err);
//});

export default app;