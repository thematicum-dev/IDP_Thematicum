import Router from 'express';
import * as fundsController from '../controllers/funds.controller'
import * as authUtilities from '../utilities/authUtilities';

const router = Router();
//auth middleware
router.use('/', authUtilities.authenticationMiddleware);

router.route('/')
    .get(fundsController.list)
    .post(fundsController.create)
    .put(fundsController.update);

router.route('/:fundId')
    .delete(fundsController.remove);

export default router;