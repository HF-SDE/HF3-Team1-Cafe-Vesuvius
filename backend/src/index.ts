import express from 'express';
import cors from 'cors';
import config from '@config';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import passport from 'passport';

const app = express();
app.use(cors({credentials: true, origin: config.WHITELISTED_ORIGINS.split(' ')}));
app.use(helmet());
app.use(bodyParser.json({}));
app.use(passport.initialize());

//Insert all routes here

app.listen(config.PORT, () => {
    console.log(`Server is running on ${config.PORT}`);
});