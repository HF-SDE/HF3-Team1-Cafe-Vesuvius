import { Router } from 'express';

import {
  createRecord,
  deleteRecord,
  getAll,
} from '@controllers/default.controller';
import * as StockController from '@controllers/stock.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';
import { isAllowed } from '@middlewares/isAllowed.mw';
import { create, where } from '@schemas/rawMaterial.schema';

const router = Router();

router.use('/', verifyJWT);

router.get('/', isAllowed(['stock:view']), getAll(where, 'rawMaterial')); // StockController.getStock
router.post(
  '/',
  isAllowed(['stock:create']),
  createRecord(create, 'rawMaterial'),
);
router.put('/', isAllowed(['stock:update']), StockController.updateStock);
router.delete('/:id', isAllowed(['stock:delete']), deleteRecord('rawMaterial'));

export default router;
