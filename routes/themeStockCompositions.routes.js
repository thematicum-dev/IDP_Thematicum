// var express = require('express');
// var router = express.Router();
// var themeStockCompositionsController = require('../controllers/themeProperties.controller');
// var authUtilities = require('../utilities/authUtilities');
//
// //auth middleware
// router.use('/', authUtilities.authenticationMiddleware);
//
// //themestockcompositions
// router.route('/theme/:themeId')
//     .post(themeStockCompositionsController.create);
//
// // router.route('/theme/:themeId/user')
// //     .get(themePropertiesController.listByThemeAndUser)
//
// router.route('/:stockcompositionId')
//     .put(themeStockCompositionsController.update) //e.g. validate by admin
//     .delete(themeStockCompositionsController.delete); //e.g. exclude by admin
//
// router.param('themeId', themeStockCompositionsController.themeById);
// router.param('stockcompositionId', themeStockCompositionsController.themePropertyById);
//
// module.exports = router;