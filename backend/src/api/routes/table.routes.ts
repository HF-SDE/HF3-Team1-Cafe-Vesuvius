import { Router } from 'express';

import * as TableController from '@controllers/table.controller';
import { verifyJWT } from '@middlewares/authenticate';
import { isAllowed } from '@middlewares/isAllowed';

const router = Router();

const perms = ['table:view'];

router.get('/', verifyJWT, isAllowed(perms), TableController.getTables);
router.get('/:id', verifyJWT, isAllowed(perms), TableController.getTable);

export default router;
