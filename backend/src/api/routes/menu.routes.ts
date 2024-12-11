import { Router } from 'websocket-express';

import {
  createRecord,
  getAll,
  softDeleteRecord,
  updateRecord,
} from '@controllers/default.controller';
import { transformMenusItems } from '@controllers/menu.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';
import { isAllowed } from '@middlewares/isAllowed.mw';
import { transformPatch } from '@middlewares/menu.mw';
import { validateParams } from '@middlewares/validate.mw';

const router = new Router();

router.use('/', validateParams);

router.get(['/', '/:id'], getAll('menuItem'));

router.use('/', verifyJWT);

router.ws('/', isAllowed(['menu:view']), getAll('menuItem'));

router.post(
  '/',
  isAllowed(['menu:create']),
  transformMenusItems,
  createRecord('menuItem'),
);
router.put('/:id', isAllowed(['menu:update']), updateRecord('menuItem'));
router.patch(
  '/:id',
  isAllowed(['menu:update']),
  transformPatch,
  updateRecord('menuItem'),
);
router.delete('/:id', isAllowed(['menu:delete']), softDeleteRecord('menuItem'));

export default router;
