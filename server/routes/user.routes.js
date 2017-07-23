import Router from 'express';
import * as userController from '../controllers/user.controller';
import * as activityController from '../controllers/activity.controller';
import * as authUtilities from '../utilities/authUtilities';

const router = Router();

//auth middleware
router.use('/', authUtilities.authenticationMiddleware);


router.route('/follow')
    .get(userController.getFollowStatus)
    .put(userController.follow)
    .delete(userController.unfollow);


//router.route('/activity/:userEmail')
   // .get(activityController.getActivityByUser)
    //.delete(activityController.deleteActivityByUser);

export default router;