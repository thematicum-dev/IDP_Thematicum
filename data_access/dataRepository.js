var _ = require('underscore');
var UserThemeInput = require('../models/userThemeInput');
var Theme = require('../models/theme');
var userInputAggregation = require('../utilities/userInputAggregation');

module.exports = {
    getAll: getAll,
    getById: getById,
    getAllThemeTags: getAllThemeTags,
    getThemeByTextSearch: getThemeByTextSearch,
    getThemeById: getThemeById,
    addUserInput: addUserInput
}

function getAll(collection, callback){
    collection.find(function (err, results) {
        if (err) {
            callback({
                title: 'An error occurred getting items from ' + collection.toString(),
                error: err
            }, null);
        }

        if (!results) {
            callback({
                title: 'No results found',
                error: { message: 'No results found from ' + collection.toString() },
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
            //callback(null, result)
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