import Router from 'express';
import * as adminController from '../controllers/admin.controller';
import * as activityController from '../controllers/activity.controller';
import * as authUtilities from '../utilities/authUtilities';

const router = Router();

//auth middleware
//router.use('/', authUtilities.authenticationMiddleware);
router.route('/accesscodes')
    .get(adminController.listAccessCodes);

router.route('/themes/:themeId')
    .delete(adminController.deleteThemeByAdmin);

//Example: localhost:3000/api/admin/newsfeed/byAdminUser/taimoor.alam3%40gmail.com?lowerLimit=0&upperLimit=10&lowerTimeLimit=1438172716783&upperTimeLimit=1501330870910
router.route('/newsfeed/byAdminUser/:userEmail')
    .get(activityController.getActivityByAdminBetweenTimeAndLimits);

router.param('themeId', adminController.themeById);
router.param('userEmail', activityController.userByEmail);

export default router;