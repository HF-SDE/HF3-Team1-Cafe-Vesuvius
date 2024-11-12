import { Router } from 'express';

import { create, getAll, update } from '@controllers/default.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';
import { isAllowed } from '@middlewares/isAllowed.mw';
import { validateParams } from '@middlewares/validate.mw';

const router = Router();

router.use('/', verifyJWT);
router.use('/:id', validateParams);

router.get(['/', '/:id'], isAllowed(['order:view']), getAll);
router.post('/', isAllowed(['order:create']), create);
router.put('/:id', isAllowed(['order:update']), update);

export default router;
