import Router from 'express';

import * as stockPrice from '../controllers/stockPrice.controller';

import * as themeController from "../controllers/themes.controller";

const router = Router();

router.route('/')
    .get(stockPrice.getStockPrices);

//router.param('theme', themeController.themeById);

export default router;