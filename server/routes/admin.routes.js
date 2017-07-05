import Router from 'express';
import * as adminController from '../controllers/admin.controller';
import * as authUtilities from '../utilities/authUtilities';

const router = Router();

//auth middleware
router.use('/', authUtilities.authenticationMiddleware);
router.route('/accesscodes')
    .get(adminController.listAccessCodes);

router.route('/themes/:themeId')
    .delete(adminController.deleteThemeByAdmin);



router.param('themeId', adminController.themeById);

export default router;