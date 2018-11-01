import Router from 'express';
import * as activityController from '../controllers/activity.controller';
import * as authUtilities from '../utilities/authUtilities';

const router = Router();

//auth middleware
router.use('/', authUtilities.authenticationMiddleware);

router.route('/')
    .get(activityController.listAllByTime);

router.route('/sendemail')
	.post(activityController.sendSubscriptionEmail);

export default router;
