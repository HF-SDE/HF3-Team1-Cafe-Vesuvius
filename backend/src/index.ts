import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import fs from 'fs';
import helmet from 'helmet';
import https from 'https';
import passport from 'passport';

import config from '@config';
import authRoutes from '@routes/auth.routes';
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

// app.listen(config.PORT, () => {
//   console.log(`Server is running on ${config.PORT}`);
// });

// Load trusted SSL certificate and key
const sslOptions = {
  key: fs.readFileSync(config.SSL_KEY_PATH),
  cert: fs.readFileSync(config.SSL_CERT_PATH),
};

// Create HTTPS server with trusted SSL certificate
https.createServer(sslOptions, app).listen(config.PORT, () => {
  console.log(`Secure server is running on port ${config.PORT}`);
});
