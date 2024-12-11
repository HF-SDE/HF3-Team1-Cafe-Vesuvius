import { Router } from 'express';

import { TransformedUser } from '@api-types/user.types';
import {
  createRecord,
  getAll,
  updateRecord,
} from '@controllers/default.controller';
import { transformUserData } from '@controllers/manage.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';
import { isAllowed } from '@middlewares/isAllowed.mw';
import { transformPatch, transformPermissions } from '@middlewares/manage.mw';
import { validateParams } from '@middlewares/validate.mw';
import { User } from '@prisma/client';

const router = Router();

router.use('/', verifyJWT);

router.get(
  '/user',
  isAllowed(['administrator:users:view']),
  getAll<TransformedUser, User>('user', transformUserData),
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
  createRecord('user'),
);
router.put(
  '/user/:id',
  isAllowed(['administrator:users:update']),
  updateRecord('user'),
);
router.patch(
  '/user/:id',
  isAllowed(['administrator:users:update']),
  transformPatch,
  updateRecord('user'),
);

export default router;
