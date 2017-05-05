import Theme from '../models/theme';
import {AppError} from '../utilities/appError';
import {AppResponse} from '../utilities/appResponse';
import DataRepository from '../data_access/dataRepository';
import UserThemeInputAggregation from '../models/userThemeInputAggregation';

const repo = new DataRepository();

export function create(req, res, next) {
    const theme = new Theme({
        name: req.body.name,
        tags: req.body.tags,
        description: req.body.description,
        creator: res.locals.user
    });

    repo.save(theme)
        .then(() => res.status(201).json(new AppResponse('Theme created', theme)))
        .catch(err => next(err));
}

export function read(req, res, next) {
    // convert mongoose document to JSON
    let theme = req.theme ? req.theme.toJSON() : {};
    theme.isCurrentUserCreator = req.isCurrentUserCreator;
    return res.status(200).json(new AppResponse('Theme retrieved', theme));
}

export function update(req, res, next) {
    let theme = req.theme;

    //authorization check
    if(!req.isCurrentUserCreator) {
        return next(new AppError('Not authorized', 403));
    }

    if (req.body.name)
        theme.name = req.body.name;
    if (req.body.description)
        theme.description = req.body.description;
    if (req.body.tags)
        theme.tags = req.body.tags;

    repo.save(theme)
        .then(result => {
            let updatedTheme = result.toJSON();
            updatedTheme.isCurrentUserCreator = req.isCurrentUserCreator;
            return res.status(201).json(new AppResponse('Theme updated', updatedTheme));
        })
        .catch(err => next(err));
}

export function deleteThemeData(req, res, next) {
    const theme = req.theme;

    //authorization check
    if(!req.isCurrentUserCreator) {
        return next(new AppError('Not authorized', 403));
    }

    repo.deleteThemeData(theme)
        .then(result => {
            return res.status(200).json(new AppResponse('Theme related data deleted', result));
        })
        .catch(error => { next(error) });
}

export function getTags(req, res, next) {
    repo.getThemeTags()
        .then(tags => res.status(200).json(new AppResponse('Theme tags retrieved', Array.from(tags))))
        .catch(err => next(err));
}

export function list(req, res, next) {
    
    if (!req.query.start || isNaN(req.query.start) || req.query.start <= 0) {
        req.query.start = 1;
    }
    req.query.start = parseInt(req.query.start, 10);
    req.query.limit = 10;

    let aggregationPromise = repo.getFilteredUserThemeInputAggregations([], [], []);

    let searchQueryPromise = null;
    if(req.query.searchQuery) {
        searchQueryPromise = repo.getThemeRangeBySearchQuery(req.query.searchQuery, req.query.start, req.query.limit);
    } else{
        searchQueryPromise = repo.getRange(Theme, req.query.start, req.query.limit);
    }

    let tagsPromise = repo.getThemeByTags([]);

    Promise.all([aggregationPromise, searchQueryPromise, tagsPromise]).then(results => {
        console.log(results[0]);
        res.status(200).json(new AppResponse('Investment themes retrieved', results[1]));
        console.log(results[2]);
    })
    .catch(err => next(err));
}

export function themeById(req, res, next, id) {
    repo.getThemeById(id)
        .then(result => {
            if (!result) {
                return next(new AppError('No theme found for the given Id', 404))
            }

            req.theme = result;
            req.isCurrentUserCreator = isCurrentUserThemeCreator(result, res);
            next();
        })
        .catch(err => next(err));
}

function isCurrentUserThemeCreator(theme, res) {
    return res.locals.user && theme.creator._id.equals(res.locals.user._id);
}