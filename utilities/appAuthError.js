var AppError = require('./appError');

module.exports = class AppAuthError extends AppError {
    constructor(err, status) {
        //message is the default error name provided by JWT
        let customError = err == 'TokenExpiredError' ? 'Your session expired. Please log in again.' :
            err == 'JsonWebTokenError' ? 'Invalid authentication token. Please log in.' :
                'Authentication error';
        super(customError, status);
    }
}