import {AppError} from '../utilities/appError';
import {AppResponse} from '../utilities/appResponse';
import DataRepository from '../data_access/dataRepository';

const repo = new DataRepository();

export function listAccessCodes(req, res, next) {
    repo.getValidAccessCodes()
        .then(results => {
            if (!results) {
                return next(new AppError('No valid access codes', 404));
            }

            return res.status(200).json(new AppResponse('Access codes retrieved', results));
        })
        .catch(err => next(err));
}

export function deleteThemeByAdmin(req, res, next) {

    let theme = req.theme;
    let isCurrentLoggedInUserAdmin = res.locals.user.isAdmin == true ? true : false;
    if (isCurrentLoggedInUserAdmin){
            repo.deleteThemeData(theme)
                .then(result => {
                    return res.status(202).json(new AppResponse('Theme related data deleted', result));
                })
             .catch(error => { next(error) });
    }else{
            return res.status(400).json(new AppResponse('User is not logged in ', null));
    }

    

    
    
    //console.log(res.locals.user.isAdmin);

    // repo.getThemeById(theme._id)
    //     .then(result => {
    //         if (!result) {
    //             return next(new AppError('No theme found for the given Id', 404))
    //         }

    //         return res.status(200).json(new AppResponse('Theme related data deleted', result));
    //     })
    //     .catch(err => next(err));
}

export function themeById(req, res, next, id) {
    repo.getThemeById(id)
        .then(result => {
            if (!result) {
                return next(new AppError('No theme found for the given Id', 404))
            }

            req.theme = result;
            next();
        })
        .catch(err => next(err));
}