
import ActivityLog from '../models/activitylog';
import {AppError} from '../utilities/appError';
import {AppResponse} from '../utilities/appResponse';
import DataRepository from '../data_access/dataRepository';

const repo = new DataRepository();

export function getTrend(req, res, next) {

	repo.getThemeById(req.body.id)
				.then(theme=> {

					if(!theme) {
						return res.status(401).json(new AuthError('The theme id does not exist.', 'forgot'));
					}

					console.log(theme);

					
					

				}).catch(err => next(err));
    
    
}

