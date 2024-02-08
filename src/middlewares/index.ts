import express from 'express';

import { getUserBySessionToken } from '../db/users';

import { get, merge } from 'lodash';

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, 'identity._id') as unknown as string;

    if (!currentUserId)
      return res.sendStatus(403).json('Currently not logged in user');

    if (currentUserId.toString() !== id) {
      return res.status(403).json('you are not authorized.');
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json('Internal Server Error');
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const sessionToken = req.cookies['Authentication'];

    if (!sessionToken)
      return res.status(403).json('No session token has founded');

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) return res.status(404).json('user not found');

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json('Internal Server Error');
  }
};
