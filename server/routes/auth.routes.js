import Router from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();
router.route('/signup')
    .post(authController.signup);
router.route('/signin')
    .post(authController.signin);

router.route('/isAuthenticated')
    .get(authController.isAuthenticated);

router.route('/forgot')
	.post(authController.forgot);

router.route('/reset')
	.post(authController.reset);

export default router;
