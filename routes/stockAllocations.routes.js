var express = require('express');
var router = express.Router();
var stockAllocationsController = require('../controllers/stockAllocations.controller.js');
var authUtilities = require('../utilities/authUtilities');

//auth middleware
router.use('/', authUtilities.authenticationMiddleware);

//stockallocations
router.route('/theme/:themeId')
    .get(stockAllocationsController.listByTheme)
    .post(stockAllocationsController.createMany);

router.route('theme/:themeId/user')
    .get(stockAllocationsController.listByThemeAndUser);

router.route('theme/:themeId/themestockcompositions')
    .get(stockAllocationsController.listStockCompositions);

router.route('/themestockcomposition/:themestockcompositionId')
    .post(stockAllocationsController.create);

router.route('/:stockallocationId')
    .put(stockAllocationsController.update)
    .delete(stockAllocationsController.delete);

router.param('selectedThemeId', stockAllocationsController.themeById);
router.param('themestockcompositionId', stockAllocationsController.themeStockCompositionById);
router.param('stockallocationId', stockAllocationsController.stockAllocationById);

module.exports = router;