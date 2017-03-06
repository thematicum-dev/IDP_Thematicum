var express = require('express');
var router = express.Router();
var themePropertiesController = require('../controllers/themeProperties.controller');
var authUtilities = require('../utilities/authUtilities');

//auth middleware
router.use('/', authUtilities.authenticationMiddleware);

router.route('/theme/:themeId')
    .get(themePropertiesController.listByTheme)
    .post(themePropertiesController.create);

router.route('/:themepropertyId')
    .put(themePropertiesController.update)
    .delete(themePropertiesController.delete);

router.param('themeId', themePropertiesController.themeById);
router.param('themepropertyId', themePropertiesController.themePropertyById);

module.exports = router;