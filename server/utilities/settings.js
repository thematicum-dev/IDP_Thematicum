module.exports = {
    getDBConnectionString: getDBConnectionString
}

function getDBConnectionString() {
    let isDev = false;
    if (isDev) {
        return 'localhost:27017/thematicum';
    } else {
        return 'mongodb://' + 'admin' + ':' + 'ru!#05#2Gud4Bndj' + '@' + 'ds129179.mlab.com' + ':' + '29179' + '/' + 'thematicum-test';
    }
}