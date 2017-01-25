module.exports = class AppError {
    constructor(message, status) {
        this.message = message;
        this.status = status;
    }
}