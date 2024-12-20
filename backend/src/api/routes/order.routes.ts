import { Router } from 'websocket-express';

import { getAll } from '@controllers/default.controller';
import { createOrder, updateOrderStatus } from '@controllers/order.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';
import { isAllowed } from '@middlewares/isAllowed.mw';
import { transformSearch } from '@middlewares/order.mw';
import { validateParams } from '@middlewares/validate.mw';
import { where } from '@schemas/order.schema';

const router = new Router();

router.use('/', verifyJWT);
router.use('/:id', validateParams);

router.get(
  ['/', '/:id'],
  isAllowed(['order:view']),
  transformSearch,
  getAll(where),
);
router.ws('/', isAllowed(['order:view']), getAll(where));

router.post('/', isAllowed(['order:create']), createOrder);
router.put(
  '/:id',
  isAllowed(['order:status:update:completed', 'order:status:update:deliver']),
  updateOrderStatus,
);

export default router;
