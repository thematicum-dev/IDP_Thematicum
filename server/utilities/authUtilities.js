var jwt = require('jsonwebtoken');
var AppAuthError = require('./appAuthError');

module.exports = {
    authenticationMiddleware: jwtVerifyReq,
    jwtVerify: jwtVerify,
    jwtSign: jwtSign
}

let expiration = {expiresIn: 7200}; //token expires in 7200 sec (2 hr)
let jwtSecret = process.env.JWT_SECRET || 'secret';

function jwtVerifyReq(req, res, next) {
    var token = req.query.token;
    jwtVerify(token)
        .then(decoded => {
            //var decodedToken = jwt.decode(token); //TODO: redundant?
            res.locals.user = decoded.user; //TODO: consistency
            //TODO: check if user exists in the db?
            next();
        })
        .catch(err => next(new AppAuthError(err.name, 401)));
}

function jwtVerify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtSecret, function (err, decoded) {
            if (err) {
                //invalid token
                reject(err);
            }

            resolve(decoded);
        });
    });
}

function jwtSign(payload) {
    return jwt.sign(payload, jwtSecret, expiration);
}