import { Router } from 'websocket-express';

import {
  create,
  deleteRecord,
  getAll,
  update,
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
  create('menuItem'),
);
router.put('/:id', isAllowed(['menu:update']), update('menuItem'));
router.patch(
  '/:id',
  isAllowed(['menu:update']),
  transformPatch,
  update('menuItem'),
);
router.delete('/:id', isAllowed(['menu:delete']), deleteRecord('menuItem'));

export default router;
