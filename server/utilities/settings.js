module.exports = {
    getDBConnectionString: getDBConnectionString
}

function getDBConnectionString() {
    return 'mongodb://' + 'admin' + ':' + 'ru!#05#2Gud4Bndj' + '@' + 'ds129179.mlab.com' + ':' + '29179' + '/' + 'thematicum-test';
    // if (process.env.ENV == 'development') {
    //     return process.env.LOCAL_HOST + ':' + process.env.LOCAL_MONGODB_PORT + '/' + process.env.LOCAL_MONGODB_DBNAME;
    // } else if (process.env.ENV == 'production') {
    //     return 'mongodb://' + 'admin' + ':' + 'ru!#05#2Gud4Bndj' + '@' + 'ds129179.mlab.com' + ':' + '29179' + '/' + 'thematicum-test';
    //
    //     //return 'mongodb://' + process.env.MLAB_USER + ':' + process.env.MLAB_PASSWORD + '@' + process.env.MLAB_DOMAIN + ':' + process.env.MLAB_PORT + '/' + process.env.MLAB_DBANME;
    // }
}