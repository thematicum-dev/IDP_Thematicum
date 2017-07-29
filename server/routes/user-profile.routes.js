import Router from 'express';
import * as userController from '../controllers/user.controller';
import * as activityController from '../controllers/activity.controller';
import * as authUtilities from '../utilities/authUtilities';

const router = Router();

//auth middleware
//router.use('/', authUtilities.authenticationMiddleware);

router.route('/newsfeed/byUser/:userEmail')
    .get(activityController.getActivityByUser);

router.route('/newsfeed/byThemesOfAUser/:userEmail')
    .get(activityController.getActivityByThemesOfAUser);

router.param('userEmail', activityController.userByEmail);

export default router;