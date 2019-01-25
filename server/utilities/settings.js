export function getDBConnectionString() {
    if (process.env.ENV == 'development') {
       return process.env.LOCAL_HOST + ':' + process.env.LOCAL_MONGODB_PORT + '/' + process.env.LOCAL_MONGODB_DBNAME;
    } else if (process.env.ENV == 'production') {
        return 'mongodb://' + process.env.MLAB_USER + ':' + process.env.MLAB_PASSWORD + '@' + process.env.MLAB_DOMAIN + ':' + process.env.MLAB_PORT + '/' + process.env.MLAB_DBANME;
    }

    // const pass = 'aovaleh1';
    // return 'mongodb://Valeh:'+pass+'@ds161740.mlab.com:61740/thematicum';
}