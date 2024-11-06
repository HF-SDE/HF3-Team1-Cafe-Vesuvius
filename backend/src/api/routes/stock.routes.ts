import { Router } from 'express';

import * as StockController from '@controllers/stock.controller';
import { authenticateJwt } from 'passport';

const router = Router();

router.get('/', authenticateJwt , StockController.getStock);

export default router;
