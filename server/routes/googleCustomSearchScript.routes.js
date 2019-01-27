import Router from 'express';

import * as customSearchScript from '../controllers/googleCustomSearchScript.controller';

import * as themeController from "../controllers/themes.controller";

const router = Router();

router.route('/')
    .get(customSearchScript.getCustomSearchResults);

//router.param('theme', themeController.themeById);

export default router;