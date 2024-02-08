import express from 'express';

import { deleteUser, getAllUsers, updateUser } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares/index';

export default (router: express.Router) => {
  router.get('/users', isAuthenticated, getAllUsers);

  router.put('/update-user/:id', isAuthenticated, isOwner, updateUser);

  router.delete('/delete-user/:id', isAuthenticated, isOwner, deleteUser);
};
