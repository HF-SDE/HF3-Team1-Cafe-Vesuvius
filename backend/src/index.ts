import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import passport from 'passport';

import config from '@config';

const app = express();
app.use(
  cors({ credentials: true, origin: config.WHITELISTED_ORIGINS.split(' ') }),
);
app.use(helmet());
app.use(bodyParser.json({}));
app.use(passport.initialize());

//Insert all routes here

app.listen(config.PORT, () => {
  console.log(`Server is running on ${config.PORT}`);
});
