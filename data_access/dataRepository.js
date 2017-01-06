module.exports = {
    getAll: getAll
}

function getAll(collection, callback){
    collection.find(function (err, objects) {
        callback(err, objects);
    });
}