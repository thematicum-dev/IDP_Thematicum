import Router from 'express';
import * as themePropertiesController from '../controllers/themeProperties.controller';
import * as authUtilities from '../utilities/authUtilities';

const router = Router();
//auth middleware
router.use('/', authUtilities.authenticationMiddleware);

router.route('/theme/:themeId')
    .get(themePropertiesController.listByThemeId)
    .post(themePropertiesController.create);

router.route('/:themepropertyId')
    .put(themePropertiesController.update)
    .delete(themePropertiesController.deleteThemeProperty);

router.param('themeId', themePropertiesController.themeById);
router.param('themepropertyId', themePropertiesController.themePropertyById);

export default router;