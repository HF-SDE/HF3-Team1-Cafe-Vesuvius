import argon2 from 'argon2';
import { Request } from 'express';
import passport from 'passport';
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

import config from '@config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let opts: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.ACCESS_TOKEN_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    const user = await prisma.user.findUnique({
      where: { id: jwt_payload.sub },
    });

    if (user) return done(null, user);
    else return done(null, false);
  }),
);

// Temp for now
passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (
      req: Request,
      username: string,
      password: string,
      done: Function,
    ) => {
      try {
        // Hash the password before saving
        const hashedPassword = await argon2.hash(password);

        // Extract additional fields from req.body
        const { initials, email, name } = req.body;

        const user = await prisma.user.create({
          data: {
            username,
            password: hashedPassword, // Store the hashed password
            initials: initials || '', // Default to empty string if not provided
            email: email || '', // Default to empty string if not provided
            name: name || '', // Default to empty string if not provided
          },
        });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username: string, password: string, done: Function) => {
      try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        // Validate the password using Argon2
        const validate = await argon2.verify(user.password, password);
        if (!validate) {
          return done(null, false, { message: 'Wrong Password' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    },
  ),
);
