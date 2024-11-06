import { Router } from 'express';

import * as TableController from '@controllers/table.controller';
import { verifyJWT } from '@middlewares/authenticate';
import { isAllowed } from '@middlewares/isAllowed';

const router = Router();

router.get('/', verifyJWT, isAllowed([]), TableController.getTables);
router.get('/:id', verifyJWT, isAllowed([]), TableController.getTable);

export default router;
