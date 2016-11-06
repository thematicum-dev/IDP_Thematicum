var RegistrationAccessCode = require('../models/accessCode');

module.exports = {
    isAccessCodeValid: function(code, currentTime, callback) {
        RegistrationAccessCode.findOne({code: code, validFrom: {'$lte': currentTime}, validUntil: {'$gte': currentTime}}, function(err, results) {
            accessCode = !!results;
            callback(err, accessCode);
        });
    }
}