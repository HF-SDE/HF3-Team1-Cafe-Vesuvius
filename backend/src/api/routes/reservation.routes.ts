import { Router } from 'websocket-express';

import {
  create,
  deleteRecord,
  getAll,
  update,
} from '@controllers/default.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';
import { isAllowed } from '@middlewares/isAllowed.mw';
import { manageTables, transformFilters } from '@middlewares/reservation.mw';
import { validateParams } from '@middlewares/validate.mw';

const router = new Router();

router.post('/', manageTables, create());

router.use('/', verifyJWT);
router.use('/:id', validateParams);

router.get(
  ['/', '/:id'],
  transformFilters,
  isAllowed(['reservation:view']),
  getAll(),
);
router.ws('/', isAllowed(['reservation:view']), getAll());
router.put('/:id', isAllowed(['reservation:update']), update());
router.delete('/:id', isAllowed(['reservation:delete']), deleteRecord());

export default router;
