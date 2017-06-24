import Theme from '../models/theme';
import {AppError} from '../utilities/appError';
import {AppResponse} from '../utilities/appResponse';
import DataRepository from '../data_access/dataRepository';

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

     if (!req.query.searchType || isNaN(req.query.searchType) || req.query.searchType <= 0) {
        req.query.searchType = 1;
    }
    req.query.searchType = parseInt(req.query.searchType, 10);

    var concatenatedNumberStringToArray = function (concatenatedString) {
        if (!concatenatedString || concatenatedString.length == 0) {
            return [];
        } else if (concatenatedString.length > 0) {
            concatenatedString = concatenatedString.split(",");
            concatenatedString.forEach(function (value, i) {
                concatenatedString[i] = parseInt(value, 10);
            });
            return concatenatedString;
        }
        else return [];
    }

    var concatenatedStringToArray = function (concatenatedString) {
        if (!concatenatedString || concatenatedString.length == 0) {
            return [];
        } else if (concatenatedString.length > 0) {
            concatenatedString = concatenatedString.split(",");
            return concatenatedString;
        }
        else return [];
    }

    req.query.categories = concatenatedNumberStringToArray(req.query.categories);
    req.query.maturity = concatenatedNumberStringToArray(req.query.maturity);
    req.query.timeHorizon = concatenatedNumberStringToArray(req.query.timeHorizon);
    req.query.tags = concatenatedStringToArray(req.query.tags);

    if (req.query.searchType == 1) {
        repo.getThemeByUserThemeQueryPagination(req.query.start, req.query.limit, req.query.searchQuery, req.query.categories, req.query.maturity, req.query.timeHorizon, req.query.tags)
            .then(results => {
                res.status(200).json(new AppResponse('Investment themes retrieved', results));
            }).catch(err => next(err));
    } else if (req.query.searchType == 2) {
        repo.getThemeByUserStockQueryPagination(req.query.start, req.query.limit, req.query.searchQuery, req.query.categories, req.query.maturity, req.query.timeHorizon, req.query.tags)
            .then(results => {
                res.status(200).json(new AppResponse('Investment themes retrieved', results));
            }).catch(err => next(err));
    }
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