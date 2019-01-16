import Router from 'express';

import * as googleNews from '../controllers/googleNews.controller';
import * as themeController from "../controllers/themes.controller";
import * as realtimeNewsController from "../controllers/googleNews.controller"
import * as authUtilities from "../utilities/authUtilities";
const router = Router();

router.use('/', authUtilities.authenticationMiddleware);

router.route('/realtimenews/theme/:theme')
    .get(googleNews.getRealtimeNews);

router.route('/relevantnews/theme/:theme')
    .get(googleNews.getRelevantNews);

router.route('/marknewsrelevant/:newsId')
    .put(googleNews.markNewsAsRelevant);

router.param('theme', themeController.themeById);
router.param('newsId', realtimeNewsController.newsById);

export default router;