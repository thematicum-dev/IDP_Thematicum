
import ActivityLog from '../models/activitylog';
import {AppError} from '../utilities/appError';
import {AppResponse} from '../utilities/appResponse';
import DataRepository from '../data_access/dataRepository';
import TrendApi from 'google-trends-api';

const repo = new DataRepository();


var resultArray = []
export  function getAllTrends(req, res, next) {



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

		

		var noOfIteration = Math.floor(query.length / 5);

		if((query.length - noOfIteration) != 0) {
			noOfIteration += 1;
		}

		console.log("NUmber of iteration: " + noOfIteration);

		var promises = [];

		for (let i = 0; i < noOfIteration; i++) {

			var tempArray = query.splice(0,5);

			promises.push(doAjax(tempArray));
			
		}

		Promise.all(promises).then(function() {
		    console.log(resultArray.length)

		    var o = {value: []}
		    o['timeline'] = resultArray[0]['timeline'];

		    var index = 0;

		    for (var i = 0; i < resultArray.length; i++) {
		    	for (var j = 0; j < resultArray[i].value.length; j++) {
		    		o.value[index++] = resultArray[i].value[j]
		    	}
		    }
		    resultArray = [];
		    return res.status(200).json(new AppResponse('Theme trend retrieved', o));
		}, function(err) {
		    console.log(err);
		});
		

		
			
    
    
}

function doAjax(tempArray) {
    return new Promise(function(resolve, reject) {
        var result = getTrendGroup(tempArray);
        
        return resolve(result);
    });
}

async function getTrendGroup(tempArray) {
	
	 await TrendApi.interestOverTime({keyword: tempArray,startTime: new Date(Date.now() - (5*365*24 * 60 * 60 * 1000))})
			.then(function(results){

				var outputResult = JSON.parse(results);
				var parsedResult = outputResult.default.timelineData;
			  	

				var o = {value: []} // empty Object
				

				let resultDate = parsedResult.map(a => a.formattedTime);

				o['timeline'] = resultDate;

				for(var i=0; i< tempArray.length; i++) {
					
					o.value[i] = {};
					o.value[i]['trendName'] = tempArray[i];
					o.value[i]['value'] = parsedResult.map(a => a.value[i]);

				}

				console.log(o.value.length)
				resultArray.push(o);
			})
			.catch(function(err){
			  console.error('Oh no there was an error', err);
			});
}

