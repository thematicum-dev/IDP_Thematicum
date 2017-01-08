var jwt = require('jsonwebtoken');

module.exports = {
    authenticationMiddleware: jwtVerify
}

function jwtVerify(req, res, next) {
    //TODO: non-hardcoded value
    var token = req.query.token;
    jwt.verify(token, 'secret', function(err, decoded) {
        if(err) {
            //invalid token
            next({
                title: 'Not Authenticated',
                error: err,
                status: 401
            });
        }

        //var decodedToken = jwt.decode(token); //TODO: redundant?
        res.locals.user = decoded;
        next();
    });
}

function jwtDecode() {
}