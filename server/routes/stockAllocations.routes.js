import Router from 'express';
import * as stockAllocationsController from '../controllers/stockAllocations.controller';
import * as authUtilities from '../utilities/authUtilities';

const router = Router();
//auth middleware
router.use('/', authUtilities.authenticationMiddleware);

//stockallocations
router.route('/theme/:themeId')
    .get(stockAllocationsController.listByTheme)
    .post(stockAllocationsController.createMany);

router.route('/themestockcomposition/:themestockcompositionId')
    .post(stockAllocationsController.create);

router.route('/:stockallocationId')
    .put(stockAllocationsController.update)
    .delete(stockAllocationsController.deleteStockAllocation);

router.param('themeId', stockAllocationsController.themeById);
router.param('themestockcompositionId', stockAllocationsController.themeStockCompositionById);
router.param('stockallocationId', stockAllocationsController.stockAllocationById);

export default router;