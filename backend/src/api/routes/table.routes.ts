import { Router } from 'express';

import {
  createTable,
  deleteTable,
  getTables,
} from '@controllers/table.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';
import { isAllowed } from '@middlewares/isAllowed.mw';
import { validateParams } from '@middlewares/validate.mw';

const router = Router();

router.use('/', verifyJWT);
router.use('/:id', validateParams);

router.get(['/', '/:id'], isAllowed(['table:view']), getTables);
router.post('/', isAllowed(['table:create']), createTable);
router.delete('/:id', isAllowed(['table:delete']), deleteTable);

export default router;
