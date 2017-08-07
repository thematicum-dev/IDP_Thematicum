import Router from 'express';
import * as userController from '../controllers/user.controller';
import * as activityController from '../controllers/activity.controller';
import * as authUtilities from '../utilities/authUtilities';

const router = Router();

//auth middleware
router.use('/', authUtilities.authenticationMiddleware);

//http://localhost:3000/api/profile/newsfeed/byUser/taimoor.alam3%40gmail.com?from=0&to=10
//http://localhost:3000/api/profile/newsfeed/byUser/taimoor.alam3%40gmail.com
router.route('/newsfeed/byUser/:userEmail')
    .get(activityController.getActivityByUser);

    //http://localhost:3000/api/profile/newsfeed/byThemesOfAUser/taimoor.alam3%40gmail.com?from=0&to=10
    //http://localhost:3000/api/profile/newsfeed/byThemesOfAUser/taimoor.alam3%40gmail.com
router.route('/newsfeed/byThemesOfAUser/:userEmail')
    .get(activityController.getActivityByThemesOfAUser);

    //http://localhost:3000/api/profile/newsfeed/themes/taimoor.alam3%40gmail.com
router.route('/newsfeed/themes/:userEmail')
    .get(activityController.getThemesAUserFollows);

router.param('userEmail', activityController.userByEmail);

export default router;