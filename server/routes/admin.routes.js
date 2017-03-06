import Router from 'express';
import * as adminController from '../controllers/admin.controller';

const router = Router();
router.route('/accesscodes')
    .get(adminController.listAccessCodes);

export default router;