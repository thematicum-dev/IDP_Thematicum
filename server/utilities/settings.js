export function getDBConnectionString() {
    if (process.env.ENV == 'development') {
        return process.env.LOCAL_HOST + ':' + process.env.LOCAL_MONGODB_PORT + '/' + process.env.LOCAL_MONGODB_DBNAME;
    } else if (process.env.ENV == 'production') {
        return 'mongodb://' + process.env.ATLAS_USER + ':' + process.env.ATLAS_PASSWORD + '@' + process.env.ATLAS_HOSTNAME + '/' + process.env.ATLAS_DBNAME + '?ssl=true&replicaSet=atlas-bnxmvr-shard-0&authSource=admin&retryWrites=true&w=majority';
    }
}
