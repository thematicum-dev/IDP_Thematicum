import Router from 'express';
import * as adminController from '../controllers/admin.controller';
import * as activityController from '../controllers/activity.controller';
import * as authUtilities from '../utilities/authUtilities';

const router = Router();

//auth middleware
router.use('/', authUtilities.authenticationMiddleware);
router.route('/accesscodes')
    .get(adminController.listAccessCodes);

router.route('/themes/:themeId')
    .delete(adminController.deleteThemeByAdmin);

//Example with all limits: localhost:3000/api/admin/newsfeed/byAdminUser/taimoor.alam3%40gmail.com?from=0&to=10&fromTime=1438172716783&toTime=1501330870910
//Example with only limits: localhost:3000/api/admin/newsfeed/byAdminUser/taimoor.alam3%40gmail.com?from=0&to=10
//Example without any limits: localhost:3000/api/admin/newsfeed/byAdminUser/taimoor.alam3%40gmail.com
router.route('/newsfeed/byAdminUser/:userEmail')
    .get(activityController.getActivityByAdminBetweenTimeAndLimits);

router.route('/stockcompositions/:compositionId')
    .delete(adminController.deleteStockCompositionByAdmin);

router.route('/stockcompositions/validate/:compositionId/:validation')
    .put(adminController.validateStockComposition);

router.param('themeId', adminController.themeById);
router.param('userEmail', activityController.userByEmail);

export default router;