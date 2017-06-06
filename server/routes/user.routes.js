import Router from 'express';
import * as userController from '../controllers/user.controller';
import * as authUtilities from '../utilities/authUtilities';

const router = Router();
//auth middleware
router.use('/', authUtilities.authenticationMiddleware);

router.route('/:userEmail')
    .get(userController.read)
    .put(userController.update);

router.route('/follow')
    .post(userController.follow)
    .delete(userController.unfollow);

export default router;