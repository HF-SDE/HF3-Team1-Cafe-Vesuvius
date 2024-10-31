import { Router } from 'express';

const router = Router();

router.use('/', (req, res, next) => {
  console.log('Middleware');
  next();
});

export default router;
