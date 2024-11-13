import { Router } from 'express';

import * as ManageController from '@controllers/manage.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';
import { isAllowed } from '@middlewares/isAllowed.mw';

const router = Router();

router.put('/reset', ManageController.changePassword);
router.get('/manage/user', verifyJWT, isAllowed(['administrator:users:view']), ManageController.getUsers);

export default router;
