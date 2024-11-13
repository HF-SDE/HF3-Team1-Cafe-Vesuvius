import { Router } from 'express';

import * as ManageController from '@controllers/manage.controller';

const router = Router();

router.put('/password', ManageController.changePassword);
router.get('/manage/user', ManageController.getUsers);

export default router;
