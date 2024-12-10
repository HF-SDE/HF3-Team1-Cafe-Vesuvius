import { Router } from 'express';

import {
  createRecord,
  deleteRecord,
  getAll,
} from '@controllers/default.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';
import { isAllowed } from '@middlewares/isAllowed.mw';
import { validateParams } from '@middlewares/validate.mw';

const router = Router();

router.use('/', verifyJWT);
router.use('/:id', validateParams);

router.get(['/', '/:id'], isAllowed(['table:view']), getAll());
router.post('/', isAllowed(['table:create']), createRecord());
router.delete('/:id', isAllowed(['table:delete']), deleteRecord());

export default router;
