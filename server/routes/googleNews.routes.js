import Router from 'express';

import * as googleNews from '../controllers/news.controller';
import * as themeController from "../controllers/themes.controller";
import * as realtimeNewsController from "../controllers/news.controller"
import * as authUtilities from "../utilities/authUtilities";
const router = Router();

router.use('/', authUtilities.authenticationMiddleware);

router.route('/realtimenews/theme/:theme')
    .get(googleNews.getRealtimeNews);

router.route('/relevantnews/theme/:theme')
    .get(googleNews.getRelevantNews);

router.route('/performnewsupvote/:newsId')
    .put(googleNews.performNewsUpVote);

router.route('/performnewsdownvote/:newsId')
    .put(googleNews.performNewsDownVote);

router.param('theme', themeController.themeById);
router.param('newsId', realtimeNewsController.newsById);

export default router;