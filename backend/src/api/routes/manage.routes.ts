import { Router } from 'express';

import { getAll } from '@controllers/default.controller';
import * as ManageController from '@controllers/manage.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';
import { isAllowed } from '@middlewares/isAllowed.mw';
import { validateParams } from '@middlewares/validate.mw';

const router = Router();

router.use('/', verifyJWT);

router.get(
  '/user',
  isAllowed(['administrator:users:view']),
  ManageController.getUsers,
);
router.get(
  ['/permission', '/permission/:id'],
  isAllowed(['permission:view']),
  validateParams,
  getAll('permission'),
);

export default router;
