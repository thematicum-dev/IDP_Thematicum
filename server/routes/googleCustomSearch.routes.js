import Router from 'express';

import * as customSearch from '../controllers/googleCustomSearch.controller';
import * as themeController from "../controllers/themes.controller";
import * as authUtilities from "../utilities/authUtilities";


const router = Router();

router.use('/', authUtilities.authenticationMiddleware);

router.route('/')
    .get(customSearch.getCustomSearchResults);

router.route('/theme/:theme')
    .get(customSearch.getCustomSearchResults);

router.route('/getranking')
    .get(customSearch.getRanking);

router.route('/performreportupvote/:reportId')
    .put(customSearch.performReportUpVote);

router.route('/performreportdownvote/:reportId')
    .put(customSearch.performReportDownVote);

router.param('theme', themeController.themeById);
router.param('reportId', customSearch.reportById);

export default router;