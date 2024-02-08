import express from 'express';

import { createUser, getUserByEmail } from '../db/users';

import { authentication, random } from '../helpers/encrypt';

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) return res.status(400);

    const existingUser = await getUserByEmail(email);

    if (existingUser) return res.status(400).json('email already exists.');

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.error(error);
    return res.status(400);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json('email or password required');

    const user = await getUserByEmail(email).select(
      '+authentication.salt +authentication.password',
    );

    if (!user) return res.status(404).json('User does not exists.');

    const salt = user.authentication?.salt || ''; // Using optional chaining with a default value

    const expectedHash = authentication(salt, password);

    if (user.authentication?.password !== expectedHash)
      return res.status(403).json('Incorrect Password');

    const saltRandom = random();

    user.authentication.sessionToken = authentication(
      saltRandom,
      user._id.toString(),
    );

    await user.save();

    res.cookie('Authentication', user.authentication.sessionToken, {
      domain: 'localhost',
      path: '/',
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};
