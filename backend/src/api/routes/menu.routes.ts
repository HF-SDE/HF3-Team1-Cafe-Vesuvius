import { Router } from 'express';

import {
  create,
  deleteRecord,
  getAll,
  update,
} from '@controllers/default.controller';
import { transformMenusItems } from '@controllers/menu.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';
import { isAllowed } from '@middlewares/isAllowed.mw';
import { validateParams } from '@middlewares/validate.mw';

const router = Router();

router.use('/', validateParams);

router.get(['/', '/:id'], getAll('menuItem'));

router.use('/', verifyJWT);

router.post(
  '/',
  isAllowed(['menu:create']),
  transformMenusItems,
  create('menuItem'),
);
router.put('/:id', isAllowed(['menu:update']), update('menuItem'));
router.delete('/:id', isAllowed(['menu:delete']), deleteRecord('menuItem'));

export default router;