import Router from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();
router.route('/signup')
    .post(authController.signup);
router.route('/signin')
    .post(authController.signin);

// router.route('/captcha')
//     .post(authController.captcha);
router.route('/isAuthenticated')
    .get(authController.isAuthenticated);

export default router;
