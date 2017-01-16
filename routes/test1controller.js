exports.apiGET = function(req, res, next) {
    console.log('at apiGET: ', req.id)
    if (req.id > 50) {
        res.send('hello');
    } else {
        //go to error handling middleware
        next({message: 'Error Id'})
    }
};