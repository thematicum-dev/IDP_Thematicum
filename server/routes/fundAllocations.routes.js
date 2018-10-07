import Router from 'express';
import * as fundAllocationsController from '../controllers/fundAllocations.controller';
import * as authUtilities from '../utilities/authUtilities';

const router = Router();
//auth middleware
router.use('/', authUtilities.authenticationMiddleware);

//fundallocations
router.route('/theme/:themeId')
    .get(fundAllocationsController.listByTheme)
    .post(fundAllocationsController.createMany);

router.route('/themefundcomposition/:themefundcompositionId')
    .post(fundAllocationsController.create);

router.route('/:fundallocationId')
    .put(fundAllocationsController.update)
    .delete(fundAllocationsController.deleteFundAllocation);

router.param('themeId', fundAllocationsController.themeById);
router.param('themefundcompositionId', fundAllocationsController.themeFundCompositionById);
router.param('fundallocationId', fundAllocationsController.fundAllocationById);

export default router;