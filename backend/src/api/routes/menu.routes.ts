import { Router } from 'websocket-express';

import {
  createRecord,
  getAll,
  softDeleteRecord,
  updateRecord,
} from '@controllers/default.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';
import { isAllowed } from '@middlewares/isAllowed.mw';
import { transformMenusItems, transformPatch } from '@middlewares/menu.mw';
import { validateParams } from '@middlewares/validate.mw';
import { create, optional, patch, where } from '@schemas/menuItem.schema';

const router = new Router();

router.use('/', validateParams);

router.get(['/', '/:id'], getAll(where, 'menuItem'));

router.use('/', verifyJWT);

router.ws('/', isAllowed(['menu:view']), getAll(where, 'menuItem'));

router.post(
  '/',
  isAllowed(['menu:create']),
  transformMenusItems,
  createRecord(create, 'menuItem'),
);
router.put(
  '/:id',
  isAllowed(['menu:update']),
  updateRecord(optional, 'menuItem'),
);
router.patch(
  '/:id',
  isAllowed(['menu:update']),
  transformPatch,
  updateRecord(patch, 'menuItem'),
);
router.delete(
  '/:id',
  isAllowed(['menu:delete']),
  softDeleteRecord(optional, 'menuItem'),
);

export default router;
