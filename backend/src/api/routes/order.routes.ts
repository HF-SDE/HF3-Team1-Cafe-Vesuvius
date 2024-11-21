import { Router } from 'express';

import { create, getAll } from '@controllers/default.controller';
import {
  transformMenus,
  updateOrderStatus,
} from '@controllers/order.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';
import { isAllowed } from '@middlewares/isAllowed.mw';
import { validateParams } from '@middlewares/validate.mw';

const router = Router();

router.use('/', verifyJWT);
router.use('/:id', validateParams);

router.get(['/', '/:id'], isAllowed(['order:view']), getAll());
router.post('/', isAllowed(['order:create']), transformMenus, create());
router.put(
  '/:id',
  isAllowed(['order:status:update:completed', 'order:status:update:deliver']),
  updateOrderStatus,
);

export default router;
