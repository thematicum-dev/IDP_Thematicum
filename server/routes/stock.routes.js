import Router from 'express';
import * as stocksController from '../controllers/stocks.controller';
import * as authUtilities from '../utilities/authUtilities';

const router = Router();
//auth middleware
router.use('/', authUtilities.authenticationMiddleware);

router.route('/')
    .get(stocksController.list)
    .post(stocksController.create)
    .put(stocksController.update);

router.route('/:stockId')
    .delete(stocksController.remove);

export default router;