import { Router } from 'express';

import * as ManageController from '@controllers/manage.controller';

const router = Router();

router.put('/password', ManageController.changePassword);

export default router;
