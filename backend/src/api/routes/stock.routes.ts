import { Router } from 'express';
import passport from 'passport';

import * as StockController from '@controllers/stock.controller';

const router = Router();

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const accessToken = passport.authenticate('jwt', { session: false });

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
router.get('/stock', accessToken, StockController.getStock);
