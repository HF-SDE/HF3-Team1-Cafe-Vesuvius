import { Router } from 'express';

import * as StatsController from '@controllers/stats.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';

const router = Router();
router.get('/', verifyJWT, StatsController.getStats);

export default router;
