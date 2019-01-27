import Router from 'express';

import * as removeObsoleteURLs from '../controllers/removeObsoleteURLs.controller';

const router = Router();

router.route('/')
    .get(removeObsoleteURLs.removeObsoleteURLs);

export default router;