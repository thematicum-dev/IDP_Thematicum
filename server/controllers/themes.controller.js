var Theme = require('../models/theme');
var UserThemeInput = require('../models/userThemeInput');
var ThemeStockComposition = require('../models/themeStockComposition');
var UserThemeStockAllocation = require('../models/userThemeStockAllocation');
var mongoose = require('mongoose');
var _ = require('underscore');
var AppError = require('../utilities/appError');
var AppResponse = require('../utilities/appResponse');
import DataRepository from '../data_access/dataRepository';

module.exports = {
    create: create,
    read: read,
    update: update,
    deleteThemeData: deleteThemeData,
    getTags: getTags,
    list: list,
    themeById: themeById
}

let repo = new DataRepository();

function create(req, res, next) {
    var theme = new Theme({
        name: req.body.name,
        tags: req.body.tags,
        description: req.body.description,
        creator: res.locals.user
    });

    repo.save(theme)
        .then(() => res.status(201).json(new AppResponse('Theme created', theme)))
        .catch(err => next(err));
}

function read(req, res, next) {
    // convert mongoose document to JSON
    var theme = req.theme ? req.theme.toJSON() : {};
    return res.status(200).json(new AppResponse('Theme retrieved', theme));
}

function update(req, res, next) {
    var theme = req.theme;

    if (req.body.name)
        theme.name = req.body.name;
    if (req.body.description)
        theme.description = req.body.description;
    //TODO: allow empty tags or not?
    if (req.body.tags)
        theme.tags = req.body.tags;

    repo.save(theme)
        .then(result => res.status(201).json(new AppResponse('Theme updated', result)))
        .catch(err => next(err));
}

function deleteThemeData(req, res, next) {
    //TODO: delete related theme data, when deleting a theme, or not?
    var theme = req.theme;

    repo.deleteThemeData(theme)
        .then(result => {
            return res.status(200).json(new AppResponse('Theme related data deleted', result));
        })
        .catch(error => { next(error) });
}

function getTags(req, res, next) {
    repo.getThemeTags()
        .then(tags => res.status(200).json(new AppResponse('Theme tags retrieved', Array.from(tags))))
        .catch(err => next(err));
}

function list(req, res, next) {
    if(req.query.searchQuery) {
        repo.getThemeBySearchQuery(req.query.searchQuery)
            .then(results => res.status(200).json(new AppResponse('Investment themes retrieved', results)))
            .catch(err => next(err));
    } else {
        //TODO: sorting criteria
        repo.getAll(Theme)
            .then(results => res.status(200).json(new AppResponse('Investment themes retrieved', results)))
            .catch(err => next(err));
    }
}

function themeById(req, res, next, id) {
    repo.getThemeById(id)
        .then(result => {
            if (!result) {
                return next(new AppError('No theme found for the given Id', 404))
            }

            req.theme = result;
            next();
        })
        .catch(err => next(err));
};