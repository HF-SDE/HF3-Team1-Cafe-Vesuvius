import express from 'express';
import cors from 'cors';
import config from '@config';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import passport from 'passport';
import { rateLimit } from 'express-rate-limit'

import authRoutes from './api/routes/auth.routes';

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minutes
	limit: 500, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

const app = express();
app.use(cors({credentials: true, origin: config.WHITELISTED_ORIGINS.split(' ')}));
app.use(helmet());
app.use(bodyParser.json({}));
app.use(passport.initialize());
app.use(limiter)

//Insert all routes here
//app.use('/', authRoutes);

app.listen(config.PORT, () => {
    console.log(`Server is running on ${config.PORT}`);
});