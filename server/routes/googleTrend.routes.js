import Router from 'express';
import * as googleTrendController from '../controllers/googleTrend.controller';
import * as authUtilities from '../utilities/authUtilities';

const router = Router();

router.route('/trends')
    .get(googleTrendController.getAllTrends);


export default router;