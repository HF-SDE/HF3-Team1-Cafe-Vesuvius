import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import passport from 'passport';

import config from '@config';
import authRoutes from '@routes/auth.routes';
import orderRouters from '@routes/order.routes';
import reservationRoutes from '@routes/reservation.routes';
import resetRoutes from '@routes/reset.routes';
import stockRoutes from '@routes/stock.routes';
import tableRoutes from '@routes/table.routes';

import './passport';

const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_RESET_MINUTES * 60 * 1000, // 60 minutes
  limit: config.RATE_LIMIT_COUNT, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

const app = express();

app.set('trust proxy', 1);

app.use(
  cors({ credentials: true, origin: config.WHITELISTED_ORIGINS.split(' ') }),
);

app.use(helmet());
app.use(bodyParser.json({}));
app.use(passport.initialize());
app.use(limiter);

const baseRoute = '/api';
//Insert all routes here
app.use(`${baseRoute}/`, authRoutes);
app.use(`${baseRoute}/stock`, stockRoutes);
app.use(`${baseRoute}/table`, tableRoutes);
app.use(`${baseRoute}/reset`, resetRoutes);
app.use(`${baseRoute}/reservation`, reservationRoutes);
app.use(`${baseRoute}/order`, orderRouters);

app.get('/ping', (req, res) => {
  res.json({
    status: 'Server is running',
  });
});

app.listen(config.PORT, () => {
  console.log(`Server is running on ${config.PORT}`);
});
