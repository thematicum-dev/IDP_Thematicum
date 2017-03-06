import jwt from 'jsonwebtoken';
import {AppAuthError} from './appError';

const expiration = {expiresIn: 7200}; //token expires in 7200 sec (2 hr)
const jwtSecret = process.env.JWT_SECRET || 'secret';

function jwtVerifyReq(req, res, next) {
    const token = req.query.token;
    jwtVerify(token)
        .then(decoded => {
            //const decodedToken = jwt.decode(token); //TODO: redundant?
            res.locals.user = decoded.user;
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

export {jwtVerifyReq as authenticationMiddleware, jwtVerify, jwtSign}