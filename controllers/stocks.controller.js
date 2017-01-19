var Stock = require('../models/stock');

exports.list = function (req, res, next) {
    Stock.find(function(err, results) {
        if(err) {
            return next(err);
        }

        if(!results) {
            return res.status(404).send({
                message: 'No stocks found'
            });
        }

        return res.status(200).send({
            message: 'Stocks retrieved',
            obj: results
        });
    })
}