import Router from 'express';
import * as themeController from '../controllers/themes.controller';
import * as authUtilities from '../utilities/authUtilities';

const router = Router();
//auth middleware
router.use('/', authUtilities.authenticationMiddleware);

router.route('/tags')
    .get(themeController.getTags);

router.route('/')
    .get(themeController.list)
    .post(themeController.create);

router.route('/:themeId')
    .get(themeController.read)
    .put(themeController.update)
    .delete(themeController.deleteThemeData);


router.param('themeId', themeController.themeById);

export default router;
