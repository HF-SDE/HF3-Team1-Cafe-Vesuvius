import { Router } from 'express';

import * as StockController from '@controllers/stock.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';
import { isAllowed } from '@middlewares/isAllowed.mw';

const router = Router();

router.get('/', verifyJWT, isAllowed(['stock:view']), StockController.getStock);
router.post(
  '/',
  verifyJWT,
  isAllowed(['stock:create']),
  StockController.createStock,
);
router.put(
  '/',
  verifyJWT,
  isAllowed(['stock:update']),
  StockController.updateStock,
);
//router.delete('/:id', verifyJWT, isAllowed(['stock:delete']), deleteRecord());

export default router;
