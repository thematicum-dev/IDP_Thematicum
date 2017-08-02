import Router from 'express';
import * as activityController from '../controllers/activity.controller';
import * as authUtilities from '../utilities/authUtilities';

const router = Router();

//auth middleware
router.use('/', authUtilities.authenticationMiddleware);

router.route('/')
    .get(activityController.listAllByTime);

export default router;
