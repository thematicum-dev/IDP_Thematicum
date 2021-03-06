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


const axios = require('axios');


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
import removeObsoleteURLs from './server/routes/removeObsoleteURLs.routes';
import fundRoutes from './server/routes/fund.routes'
import fundAllocationRoutes from './server/routes/fundAllocations.routes'

dotenv.config({path: "dot.env"});


const app = express();

const mongodbPath = settings.getDBConnectionString();
console.log(mongodbPath)
mongoose.connect(mongodbPath, {useNewUrlParser: true, useUnifiedTopology: true})
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
app.use('/api/removeobsoleteurls', removeObsoleteURLs);
app.use('/api/funds', fundRoutes);
app.use('/api/fundallocations', fundAllocationRoutes);

app.use(function (req, res, next) {
    return res.render('index');
});


let scriptExecutionTime = new Date();
scriptExecutionTime.setHours(4, 0);
if (scriptExecutionTime < new Date()) {
    scriptExecutionTime.setDate(scriptExecutionTime.getDate() + 1);
}
let scriptURL = 'https://thematicum.herokuapp.com/api/customsearchscript';
let customSearchTriggerJobDeletionEndpoint = 'https://api.atrigger.com/v1/tasks/delete?key=' + process.env.ATRIGGER_API_KEY + '&secret=' + process.env.ATRIGGER_API_SECRET +'&tag_type=reportscript';
let customSearchTriggerJobCreationEndpoint = 'https://api.atrigger.com/v1/tasks/create?key=' + process.env.ATRIGGER_API_KEY + '&secret=' + process.env.ATRIGGER_API_SECRET +'&tag_type=reportscript&retries=0&timeSlice=1day&first=' + scriptExecutionTime.toISOString() + '&count=-1&url=' + scriptURL;

axios.request({url: customSearchTriggerJobDeletionEndpoint, method: 'get', responseType: 'json'})
    .then(() => {
        axios.request({url: customSearchTriggerJobCreationEndpoint, method: 'get', responseType: 'json'})
            .then(() => {
                console.log("Report update job created.");
            })
            .catch((err) => {
                console.log(err);
            });
    })
    .catch((err) => {
        console.log(err);
    });



let removalExecutionTime = new Date();
removalExecutionTime.setHours(1, 0);
if (removalExecutionTime < new Date()) {
    removalExecutionTime.setDate(removalExecutionTime.getDate() + 1);
}
let removalURL = 'https://thematicum.herokuapp.com/api/removeobsoleteurls';
let removalTriggerJobDeletionEndpoint = 'https://api.atrigger.com/v1/tasks/delete?key=' + process.env.ATRIGGER_API_KEY + '&secret=' + process.env.ATRIGGER_API_SECRET +'&tag_type=removalscript';
let removalTriggerJobCreationEndpoint = 'https://api.atrigger.com/v1/tasks/create?key=' + process.env.ATRIGGER_API_KEY + '&secret=' + process.env.ATRIGGER_API_SECRET +'&tag_type=removalscript&retries=0&timeSlice=1day&first=' + removalExecutionTime.toISOString() + '&count=-1&url=' + removalURL;

axios.request({url: removalTriggerJobDeletionEndpoint, method: 'get', responseType: 'json'})
    .then(() => {
        axios.request({url: removalTriggerJobCreationEndpoint, method: 'get', responseType: 'json'})
            .then(() => {
                console.log("Removal job created.");
            })
            .catch((err) => {
                console.log(err);
            });
    })
    .catch((err) => {
        console.log(err);
    });



export default app;
