import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
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

dotenv.config({path: "dot.env"});
const app = express();

const mongodbPath = settings.getDBConnectionString();
mongoose.connect(mongodbPath)
    .then(() => console.log('Connected to MongoDb'))
    .catch(error => console.log('Error connecting to MongoDb'));

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

app.use(function (req, res, next) {
    return res.render('index');
});



//error handling
//app.use(function (err, req, res, next) {
    //console.log('Error handling middleware', JSON.stringify(err))
    //return res.status(err.status || 500).json(err);
//});

export default app;