import passport from 'passport';
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';

import config from '@config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let opts: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.ACCESS_TOKEN_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    const user = await prisma.users.findUnique({ id: jwt_payload.sub });

    if (user) return done(null, user);
    else return done(null, false);
  }),
);
