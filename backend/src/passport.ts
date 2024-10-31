import { Request } from 'express';

import passport from 'passport';
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';

import { Strategy as LocalStrategy } from 'passport-local';
import argon2 from 'argon2';


import config from '@config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let opts: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.ACCESS_TOKEN_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    const user = await prisma.user.findUnique({ where: {id: jwt_payload.sub }});

    if (user) return done(null, user);
    else return done(null, false);
  }),
);

passport.use(new LocalStrategy({
usernameField: "username",
passwordField: "password",
}, 
async (username: string, password: string, done: Function) => {
  try {
    // Return success for now to test
    return done(null, null, { message: "Logged in Successfully" });

      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
          return done(null, false, { message: "User not found" });
      }

      // Validate the password using Argon2
      const validate = await argon2.verify(user.password, password);
      if (!validate) {
          return done(null, false, { message: "Wrong Password" });
      }

      return done(null, user, { message: "Logged in Successfully" });
  } catch (error) {
      return done(error);
  }
}
));