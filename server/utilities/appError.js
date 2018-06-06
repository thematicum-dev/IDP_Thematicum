export class AppError {
    constructor(message, status) {
        this.message = message;
        this.status = status;
    }
}

export class AppAuthError extends AppError {
    constructor(err, status) {
        //message is the default error name provided by JWT
        const customError = err == 'TokenExpiredError' ? 'Your session expired. Please log in again.' :
            err == 'JsonWebTokenError' ? 'Invalid authentication token. Please log in.' :
                'Authentication error';
        super(customError, status);
    }
}

export class AuthError {
    constructor(message,feature) {
        this.message = message;
        this.feature = feature;
    }
}
