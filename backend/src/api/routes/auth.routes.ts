// /routes/auth.routes.ts
import { Router } from 'express';
import passport from 'passport';
import * as authController from '../controllers/auth.controller';

const router = Router();

// This signup is temperery until we get the signup in the user rout
router.post('/signup', passport.authenticate('signup', { session: false }), authController.signUp);

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/accessToken', authController.accessToken);
router.get('/refreshToken', authController.refreshToken)

export default router;