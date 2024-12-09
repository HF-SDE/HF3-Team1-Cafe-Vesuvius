import { Router } from 'express';

import { create, getAll, update } from '@controllers/default.controller';
import { transformUserData } from '@controllers/manage.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';
import { isAllowed } from '@middlewares/isAllowed.mw';
import { transformPatch, transformPermissions } from '@middlewares/manage.mw';
import { validateParams } from '@middlewares/validate.mw';

const router = Router();

router.use('/', verifyJWT);

router.get(
  '/user',
  isAllowed(['administrator:users:view']),
  getAll('user', transformUserData),
);
router.get(
  ['/permission', '/permission/:id'],
  isAllowed(['administrator:permission:view']),
  validateParams,
  getAll('permission'),
);

router.post(
  '/user',
  isAllowed(['administrator:users:create']),
  transformPermissions,
  create('user'),
);
router.put(
  '/user/:id',
  isAllowed(['administrator:users:update']),
  update('user'),
);
router.patch(
  '/user/:id',
  isAllowed(['administrator:users:update']),
  transformPatch,
  update('user'),
);

export default router;
