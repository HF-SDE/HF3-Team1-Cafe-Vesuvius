import { Router } from 'websocket-express';

import {
  createRecord,
  deleteRecord,
  getAll,
  updateRecord,
} from '@controllers/default.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';
import { isAllowed } from '@middlewares/isAllowed.mw';
import { manageTables, transformFilters } from '@middlewares/reservation.mw';
import { validateParams } from '@middlewares/validate.mw';
import { create, optional, where } from '@schemas/reservation.schema';

const router = new Router();

router.post('/', manageTables, createRecord(create));

router.use('/', verifyJWT);
router.use('/:id', validateParams);

router.get(
  ['/', '/:id'],
  transformFilters,
  isAllowed(['reservation:view']),
  getAll(where),
);
router.ws('/', isAllowed(['reservation:view']), getAll(where));
router.put('/:id', isAllowed(['reservation:update']), updateRecord(optional));
router.delete('/:id', isAllowed(['reservation:delete']), deleteRecord());

export default router;
