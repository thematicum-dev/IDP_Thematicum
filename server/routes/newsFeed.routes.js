import Router from 'express';
import * as newsFeedController from '../controllers/newsFeed.controller';
import * as authUtilities from '../utilities/authUtilities';

const router = Router();

router.route('/newsfeed')
    .get(newsFeedController.getNews);


export default router;
