
import ActivityLog from '../models/activitylog';
import {AppError} from '../utilities/appError';
import {AppResponse} from '../utilities/appResponse';
import DataRepository from '../data_access/dataRepository';
import TrendApi from 'google-trends-api';

const repo = new DataRepository();

export async function getAllTrends(req, res, next) {


		console.log(req.query);

		var query = []

		query.push(req.query.name);

		if(req.query.tags.constructor === Array) {

			for (var i = 0; i < req.query.tags.length; i++) {
				query.push(req.query.tags[i]);
				
			}
		} else {
			
			query.push(req.query.tags);
		}
		console.log(query);

		var respo;

		await TrendApi.interestOverTime({keyword: query,startTime: new Date(Date.now() - (5*365*24 * 60 * 60 * 1000))})
			.then(function(results){

				var outputResult = JSON.parse(results);
				var parsedResult = outputResult.default.timelineData;
			  	

				var o = {value: []} // empty Object
				

				let resultDate = parsedResult.map(a => a.formattedTime);

				o['timeline'] = resultDate;

				for(var i=0; i< query.length; i++) {
					
					o.value[i] = {};
					o.value[i]['trendName'] = query[i];
					o.value[i]['value'] = parsedResult.map(a => a.value[i]);

				}

				respo = o;
				
				

				//
			})
			.catch(function(err){
			  console.error('Oh no there was an error', err);
			});

			return res.status(200).json(new AppResponse('Theme trend retrieved', respo));
    
    
}

