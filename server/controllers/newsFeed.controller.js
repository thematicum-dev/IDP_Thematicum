
import ActivityLog from '../models/activitylog';
import {AppError} from '../utilities/appError';
import {AppResponse} from '../utilities/appResponse';
import DataRepository from '../data_access/dataRepository';
import NewsAPI from 'newsapi';

const repo = new DataRepository();
const newsapi = new NewsAPI('f233db147a4543f995774df5d3aa538e');

export function getNews(req, res, next) {
	

					console.log("getnews ma ayo hai");

					console.log(req.query.name);

					//find name of the theme

					newsapi.v2.everything({
						q: req.query.name,
						language: 'en'
					}).then(response => {
						console.log(response);
						return res.status(200).json(new AppResponse('Theme news retrieved', response));
					});
					
    
    
}

