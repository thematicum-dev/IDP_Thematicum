var jwt = require('jsonwebtoken');
var AppAuthError = require('./appAuthError');

module.exports = {
    authenticationMiddleware: jwtVerify
}

function jwtVerify(req, res, next) {
    //TODO: non-hardcoded value
    var token = req.query.token;
    jwt.verify(token, 'secret', function(err, decoded) {
        if(err) {
            //invalid token
            return next(new AppAuthError(err.name, 401));
        }

        //var decodedToken = jwt.decode(token); //TODO: redundant?
        console.log('Decoded token: ', decoded)
        //TODO: Cannot read property 'user' of undefined
        //e.g. refresh a page (today)
        res.locals.user = decoded.user; //TODO: consistency
        //TODO: check if user exists in the db?
        next();
    });
}