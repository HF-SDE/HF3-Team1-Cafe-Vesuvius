// /routes/auth.routes.ts
import { Router } from 'express';

import * as authController from '../controllers/auth.controller';

const router = Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/accessToken', authController.getAccessToken);
router.get('/refreshToken', authController.getRefreshToken);

export default router;
