
import ActivityLog from '../models/activitylog';
import {AppError} from '../utilities/appError';
import {AppResponse} from '../utilities/appResponse';
import DataRepository from '../data_access/dataRepository';
import NewsAPI from 'newsapi';

const repo = new DataRepository();
const newsapi = new NewsAPI('f233db147a4543f995774df5d3aa538e');

export function getNews(req, res, next) {
	

					console.log("getnews ma ayo hai");

					console.log(req.query.tags);

					//find name of the theme

					var query = '"'+req.query.name+'"';

					for (var i = 0; i < req.query.tags.length; i++) {
						query += ' OR ' + '"'+ req.query.tags[i] +'"';
					}

					console.log(query);

					newsapi.v2.everything({
						q: query,
						language: 'en',
						sources: 'bbc-news,abc-news,al-jazeera-english,bbc-news,bloomberg,cnn,financial-post,financial-times,independent,news24,nbc-news,rt,the-economist,the-new-york-times,the-wall-street-journal,time,the-guardian-uk' ,
  						sortBy: 'relevancy',
  						pageSize: 21
					}).then(response => {
						//console.log(response);
						return res.status(200).json(new AppResponse('Theme news retrieved', response));
					});
					
    
    
}

