var Theme = require('../models/theme');
var ThemeStockComposition = require('../models/themeStockComposition');
var UserThemeStockAllocation = require('../models/userThemeStockAllocation');
var Stock = require('../models/stock');
var mongoose = require('mongoose');
var _ = require('underscore');
var stockAllocationAggregation = require('../utilities/stockAllocationAggregation');

exports.createMany = function (req, res, next) {
    //add many stocks
    Promise.all(req.body.stockAllocation.map(allocationData =>
            createStockCompositionAndAllocation(allocationData, req.theme, res.locals.user)))
        .then(result => {
            return res.status(201).json({
                message: 'Theme-stock composition and allocation created',
                obj: result
            })
        })
        .catch(error => { next(error) });
}

exports.create = function(req, res, next) {
    createStockAllocation(req.themeStockComposition, res.locals.user, req.body.exposure)
        .then(result => {
            return res.status(201).json({
                message: 'Stock allocation created',
                obj: result
            })
        })
        .catch(error => { next(error) });
}

exports.update = function(req, res, next) {
    //TODO: check implementation
    var stockAllocation = req.stockAllocation;
    stockAllocation.exposure = req.body.exposure;

    stockAllocation.save(function(err, result) {
        if(err) {
            return next(err);
        }

        return res.status(200).json({
            message: 'Stock allocation updated',
            obj: result
        });
    });
}

exports.listByTheme = function(req, res, next) {
    UserThemeStockAllocation
        .find()
        .populate({
            path: 'themeStockComposition',
            match: { theme: req.theme._id }
        }).exec(function(err, results) {
        if (err) {
            return next(err);
        }

        //filter non-null entries
        var nonNullEntries = _.filter(results, function(input) {
            return input.themeStockComposition != null;
        });

        var stockExposureDistribution = nonNullEntries != undefined && nonNullEntries.length > 0 ?
            stockAllocationAggregation.groupByStockAndExposure(nonNullEntries)
            : [];

        return res.status(201).json({
            message: 'Stock exposure distribution by theme',
            obj: stockExposureDistribution
        });
    });
}

exports.listByThemeAndUser = function(req, res, next) {
    UserThemeStockAllocation
        .find({user: res.locals.user._id})
        .populate({
            path: 'themeStockComposition',
            match: { theme: req.theme._id }
        }).exec(function(err, results) {
            if (err) {
                return next(err);
            }

            //filter non-null entries
            var nonNullEntries = _.filter(results, function(input) {
                return input.themeStockComposition != null;
            });

            return res.status(201).json({
                message: 'Stock allocations by theme and by user',
                obj: nonNullEntries
        });
    });
}

exports.listStockCompositions = function(req, res, next) {
    ThemeStockComposition.find({theme: req.theme._id})
        .populate('stock', 'companyName country')
        .exec(function(err, results) {
        if(err) {
            return next(err);
        }

        if(!results) {
            return res.status(404).send({
                message: 'No theme-stock compositions for the given theme'
            });
        }

        return res.status(200).send({
            message: 'Theme-stock compositions retrieved',
            obj: results
        });
    });
}

exports.delete = function(req, res, next) {
    //TODO: implement
}

exports.themeById = function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next({
            title: 'Mongoose Invalid Object Id',
            error: {message: 'Invalid Object Id'},
            status: 400
        });
    }

    Theme.findById(id).populate('creator', 'name personalRole')
        .exec(function (err, result) {
            if (err) {
                return next(err);
            }

            if (!result) {
                return res.status(404).send({
                    message: 'No theme found for the given Id'
                });
            }

            req.theme = result;
            next();
        });
}

exports.themeStockCompositionById = function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next({
            title: 'Mongoose Invalid Object Id',
            error: {message: 'Invalid Object Id'},
            status: 400
        });
    }

    ThemeStockComposition.findById(id, function(err, result) {
        if (err) {
            return next(err);
        }

        if (!result) {
            return res.status(404).send({
                message: 'No theme-stock composition found for the given Id'
            });
        }

        req.themeStockComposition = result;
        next();
    });
}

exports.stockAllocationById = function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next({
            title: 'Mongoose Invalid Object Id',
            error: {message: 'Invalid Object Id'},
            status: 400
        });
    }

    UserThemeStockAllocation.findById(id, function(err, result) {
        if (err) {
            return next(err);
        }

        if (!result) {
            return res.status(404).send({
                message: 'No stock allocation found for the given Id'
            });
        }

        //TODO: (maybe refactor) check authorization
        if (res.locals.user && result.user._id.equals(res.locals.user._id)) {
            req.stockAllocation = result;
            return next();
        }

        return res.status(403).send({
            message: 'Not authorized'
        });
    });
}

function createStockCompositionAndAllocation(allocationData, theme, user) {
    return getStockById(allocationData.stockId)
        .then(stock => {
            return createThemeStockComposition(theme, stock, user);
        })
        .then(themeStockComposition => {
            return createStockAllocation(themeStockComposition, user, allocationData.exposure)
        });
}

function createThemeStockComposition(theme, stock, user) {
    var themeStockComposition = new ThemeStockComposition({
        theme: theme,
        stock: stock,
        addedBy: user
    });
    return new Promise(function (resolve, reject) {
        themeStockComposition.save(function(err, result) {
            if(err) {
                reject(err);
            }

            resolve(result);
        });
    });
}

function createStockAllocation(themeStockComposition, user, exposure) {
    var stockAllocation = new UserThemeStockAllocation({
        user: user,
        themeStockComposition: themeStockComposition,
        exposure: exposure
    });

    return new Promise(function (resolve, reject) {
        stockAllocation.save(function(err, result) {
            if(err) {
                reject(err);
            }

            resolve(result);
        });
    });
}

function getStockById(id) {
    return new Promise(function (resolve, reject) {
        Stock.findById(id, function(err, result) {
            if(err) {
                reject(err);
            }

            if(!result) {
                reject({
                    title: 'No stock found',
                    error: {message: 'No stock found',
                    status: 404}
                });
            }

            resolve(result);
        });
    });
}