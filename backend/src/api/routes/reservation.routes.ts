import { Router } from 'express';

import {
  create,
  deleteRecord,
  getAll,
  update,
} from '@controllers/default.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';
import { isAllowed } from '@middlewares/isAllowed.mw';
import { manageTables } from '@middlewares/reservation.mw';
import { validateParams } from '@middlewares/validate.mw';

const router = Router();

router.post('/', manageTables, create());

router.use('/', verifyJWT);
router.use('/:id', validateParams);

router.get(['/', '/:id'], isAllowed(['reservation:view']), getAll());
router.put('/:id', isAllowed(['reservation:update']), update());
router.delete('/:id', isAllowed(['reservation:delete']), deleteRecord());

export default router;
