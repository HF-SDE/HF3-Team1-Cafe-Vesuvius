import { Router } from 'express';

import {
  createReservation,
  deleteReservation,
  getReservations,
  updateReservation,
} from '@controllers/reservation.controller';
import { verifyJWT } from '@middlewares/authenticate.mw';
import { isAllowed } from '@middlewares/isAllowed.mw';
import { validateParams } from '@middlewares/validate.mw';

const router = Router();

router.post('/', createReservation);

router.use('/', verifyJWT);
router.use('/:id', validateParams);

router.get(['/', '/:id'], isAllowed(['reservation:view']), getReservations);
router.put('/:id', isAllowed(['reservation:update']), updateReservation);
router.delete('/:id', isAllowed(['reservation:delete']), deleteReservation);

export default router;
