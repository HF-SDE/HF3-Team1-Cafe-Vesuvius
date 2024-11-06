import { Router } from 'express';

import * as TableController from '@controllers/table.controller';
import { isAllowed } from '@middlewares/isAllowed';

const router = Router();

router.get('/', isAllowed([]), TableController.getTables);
router.get('/:id', isAllowed([]), TableController.getTable);

export default router;
