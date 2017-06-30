import Router from 'express';
import * as stocksController from '../controllers/stocks.controller';
import * as authUtilities from '../utilities/authUtilities';

const router = Router();
//auth middleware
router.use('/', authUtilities.authenticationMiddleware);

router.route('/')
    .get(stocksController.list)
    .post(stocksController.create);

export default router;