module.exports = class AppResponse {
    constructor(message, object) {
        this.message = message;
        this.obj = object;
    }
}