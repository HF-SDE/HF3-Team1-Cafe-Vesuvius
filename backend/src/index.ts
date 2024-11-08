import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import passport from 'passport';

import config from '@config';
import authRoutes from '@routes/auth.routes';
import reservationRoutes from '@routes/reservation.routes';
import resetRoutes from '@routes/reset.routes';
import stockRoutes from '@routes/stock.routes';
import tableRoutes from '@routes/table.routes';

import './passport';

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  limit: 500, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

const app = express();

app.use(
  cors({ credentials: true, origin: config.WHITELISTED_ORIGINS.split(' ') }),
);
app.use(helmet());
app.use(bodyParser.json({}));
app.use(passport.initialize());
app.use(limiter);

//Insert all routes here
app.use('/', authRoutes);
app.use('/stock', stockRoutes);
app.use('/table', tableRoutes);
app.use('/reset', resetRoutes);
app.use('/reservation', reservationRoutes);

app.get('/ping', (req, res) => {
  res.json({
    status: 'Server is running',
  });
});

const port = config.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on ${config.PORT}`);
});
