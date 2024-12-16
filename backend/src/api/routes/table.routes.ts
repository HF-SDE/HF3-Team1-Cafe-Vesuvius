import { Router } from 'express';

import {
  createRecord,
  deleteRecord,
  getAll,
} from '@controllers/default.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';
import { isAllowed } from '@middlewares/isAllowed.mw';
import { transformSearch } from '@middlewares/table.mw';
import { validateParams } from '@middlewares/validate.mw';
import { create, where } from '@schemas/table.schema';

const router = Router();

router.use('/', verifyJWT);
router.use('/:id', validateParams);

router.get(
  ['/', '/:id'],
  isAllowed(['table:view']),
  transformSearch,
  getAll(where),
);
router.post('/', isAllowed(['table:create']), createRecord(create));
router.delete('/:id', isAllowed(['table:delete']), deleteRecord());

export default router;
