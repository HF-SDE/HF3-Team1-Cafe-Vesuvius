import { Router } from 'express';

import { create, getAll, update } from '@controllers/default.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';
import { isAllowed } from '@middlewares/isAllowed.mw';
import { validateParams } from '@middlewares/validate.mw';

const router = Router();

router.use('/', validateParams);

router.get(['/', '/:id'], getAll('menuItem'));

router.use('/', verifyJWT);

router.post('/', isAllowed(['menu:create']), create('menuItem'));
router.put('/:id', isAllowed(['menu:update']), update('menuItem'));
router.delete('/:id', isAllowed(['menu:delete']), update('menuItem'));

export default router;
