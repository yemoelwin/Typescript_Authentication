import express from 'express';

import { deleteUserById, getUserById, getUsers } from '../db/users';

export const getAllUsers = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json('Internal Server Error');
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    if (!deletedUser) return res.status(404).json('This user does not exist.');

    return res.status(200).json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json('Internal Server Error');
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    if (!username) return res.sendStatus(403);

    const user = await getUserById(id);
    if (!user) return res.sendStatus(404);
    user.username = username;
    await user?.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json('Internal Server Error');
  }
};
