var _ = require('underscore');
var UserThemeInput = require('../models/userThemeInput');
var Theme = require('../models/theme');
var Stock = require('../models/stock');
var userInputAggregation = require('../utilities/userInputAggregation');
var UserThemeStockAllocation = require('../models/userThemeStockAllocation');

module.exports = {
    getAll: getAll,
    getById: getById,
    getAllThemeTags: getAllThemeTags,
    getThemeByTextSearch: getThemeByTextSearch,
    getThemeById: getThemeById,
    addUserInput: addUserInput,
    addTheme: addTheme,
    updateUserInput: updateUserInput
}

function getAll(collection, callback){
    collection.find(function (err, results) {
        if (err) {
            callback({
                title: 'An error occurred getting items',
                error: err
            }, null);
        }

        if (!results) {
            callback({
                title: 'No results found',
                error: { message: 'No results found' },
                status: 404
            }, null);
        }

        callback(null, results);
    });
}

function getById(collection, id, callback) {
    collection.findById(id, function(err, result) {
        if (err) {
            callback({
                title: 'An error occurred',
                error: err
            }, null);
        }

        if (!result) {
            callback({
                title: 'No item found',
                error: {message: 'Could not find any item for the given id'},
                status: 404
            }, null);
        }

        callback(null, result);
    });
}

function getAllThemeTags(themesCollection, callback) {
    themesCollection.find({tags: { $ne: null }}, {'tags': 1, '_id': 0}, function(err, results) {
        if (err) {
            //prepare error
            callback({
                title: 'An error occurred',
                error: err
            }, null);
        }

        //TODO: 1st theme creation would result in 500 error!
        if (!results) {
            //prepare error
            callback({
                title: 'No tags found',
                error: { message: 'Could not find any tags' }
            }, null);
        }

        var tags = new Set();
        _.each(results, function (themeTags) {
            _.each(themeTags.tags, function (tag) {
                tags.add(tag)
            });
        });

        callback(null, Array.from(tags));
    });
}

function getUserThemeInputs(themeId, user, themeData, callback) {
    UserThemeInput.find({})
        .populate('theme', '_id', { _id: themeId}, null)
        .populate('user', '_id', { _id: user._id}, null)
        .exec(function(err, results) {
            if (err) {
                callback({
                    title: 'An error occurred',
                    error: err
                }, null);
            }

            if(!results) {
                callback({
                    message: 'No user inputs were found',
                    status: 404
                }, null);
            }

            /*
                 Note: { _id: themeId} clause doesn't filter documents
                 It simply populates those for which the match holds, leaving others non-populated (i.e. null valued)
                 Thus, need to filter results
             */
            var nonNullEntries = _.filter(results, function(input) {
                return input.theme != null && input.user != null;
            });

            if(nonNullEntries != undefined && nonNullEntries.length > 0) {
                //add further data to themeData
                themeData.userInputs = nonNullEntries[0];
            }

            callback(null, themeData)
        });
}

function getAllThemeInputs(theme, user, callback) {
    //get theme properties
    UserThemeInput.find({theme: theme._id}, function(err, results) {
        if (err) {
            callback({
                title: 'An error occurred',
                error: err
            }, null);
        }

        if (!results) {
            callback({
                title: 'No theme properties found',
                error: {message: 'Could not find any user input for the given theme'},
                status: 404
            }, null);
        }

        var props = [{
            propertyName: 'timeHorizon',
            nrValuesRequired: 3
        }, {
            propertyName: 'maturity',
            nrValuesRequired: 5
        }, {
            propertyName: 'categories',
            nrValuesRequired: 6
        }];

        var themeProperties = userInputAggregation.getThemePropertiesAggregation(results, props);

        var themeData = {theme: theme, properties: themeProperties};
        if(!user) {
            callback(null, themeData);
        }

        getUserThemeInputs(theme._id, user, themeData, callback);
    });
}

function getThemeById(themeCollection, themeId, user, callback) {
    themeCollection
        .findById(themeId)
        .populate('creator', 'name personalRole') //limit the user fields populated
        .exec(function (err, result) {
            if (err) {
                callback({
                    title: 'An error occurred at finding theme by id',
                    error: err
                }, null);
            }

            if (!result) {
                callback({
                    title: 'No investment theme found',
                    error: {message: 'Could not find any investment theme for the given id'},
                    status: 404
                }, null);
            }

            getAllThemeInputs(result, user, callback)
        });
}

function getThemeByTextSearch(themeCollection, searchTerm, callback) {
    themeCollection.find(
        {$text: {$search: searchTerm}},
        {score: {$meta: 'textScore'}})
        .sort({score: {$meta: "textScore"}})
        .exec(function (err, results) {
            if (err) {
                callback({
                    title: 'An error occurred at theme text search',
                    error: err
                }, null);
            }

            //TODO: if no matching theme is found, the result is [], i.e. not null
            if (!results) {
                callback({
                    title: 'No investment themes found',
                    error: {message: 'Could not find any investment theme'},
                    status: 404
                }, null);
            }

            callback(null, results);
        });
}

function addUserInput(themeId, user, reqBody, callback) {
    getById(Theme, themeId, function(err, result) {
        if (err) {
            callback(err, null)
        }

        //new UserThemeInput
        var userInput = new UserThemeInput({
            user: user,
            theme: result,
            themeProperties: {
                timeHorizon: reqBody.timeHorizon,
                maturity: reqBody.maturity,
                categories: reqBody.categories
            }
        });

        save(userInput, callback);
    });
}

function updateUserInput(userInputId, user, reqBody, callback) {
    UserThemeInput
        .findById(userInputId)
        .populate('user', '_id', { _id: user._id}, null)
        .exec(function(err, result) {
            if (err) {
                callback({
                    title: 'An error occurred',
                    error: err
                }, null);
            }

            if(!result) {
                callback({
                    title: 'No user input found',
                    error: { message: 'No user input was found for this theme'}
                }, null);
            }

            if (result.user == null) {
                callback({
                    title: 'Forbidden',
                    error: { message: 'Not authorized to modify this resource'},
                    status: 403
                }, null);
            }

            //update existing user input values
            if (reqBody.timeHorizon)
                result.themeProperties.timeHorizon = reqBody.timeHorizon;
            if (reqBody.maturity)
                result.themeProperties.maturity = reqBody.maturity;
            if (reqBody.categories)
                result.themeProperties.categories = reqBody.categories;

            save(result, callback)
        });
}

function addTheme(user, reqBody, callback) {
    //new Theme
    var theme = new Theme({
        name: reqBody.theme.name,
        tags: reqBody.theme.tags,
        description: reqBody.theme.description,
        creator: user
    });

    save(theme, function(err, theme) {
        if(err) {
            callback(err, null);
        }

        //new UserThemeInput
        var userInput = new UserThemeInput({
            user: user,
            theme: theme,
            themeProperties: {
                timeHorizon: reqBody.themeProperties.timeHorizon,
                maturity: reqBody.themeProperties.maturity,
                categories: reqBody.themeProperties.categories
            }
        });

        save(userInput, function(err, userInput) {
            if(err) {
                callback(err, null);
            }

            getRequestedStockAllocation(reqBody.stockAllocation, function(err, stockAllocation) {
                if (err) {
                    callback(err, null)
                }

                var userStockAllocation = new UserThemeStockAllocation({
                    user: user,
                    theme: theme,
                    stockAllocation: stockAllocation
                });

                save(userStockAllocation, function(err, stockAlloc) {
                    if(err) {
                        callback(err, null)
                    }

                    callback(null, [ theme, userInput, stockAlloc ]);
                });
            });
        });
    });
}

function save(data, callback) {
    data.save(function(err, result) {
        if (err) {
            callback({
                title: 'An error occurred',
                error: err
            }, null);
        }

        callback(null, result);
    });
}

//pass as parameter: req.body.stockAllocation
function getRequestedStockAllocation(stockAllocationData, callback) {
    var allocatedStocks = [];
    stockAllocationData.forEach(function(item, index){
        var stockId = item.stockId;
        var exposure = item.exposure;
        setStockAndExposure(stockId, exposure, function(err, result) {
            if(err) {
                callback(err, null)
            }

            allocatedStocks.push(result)
            if (index == stockAllocationData.length -1) {
                callback(null, allocatedStocks)
            }
        });
    });
}

function setStockAndExposure(stockId, exposure, callback) {
    getById(Stock, stockId, function(err, result) {
        if (err) {
            callback(err, null)
        }

        var stockAlloc = {stock: result, exposure: exposure};
        callback(null, stockAlloc);
    });
}