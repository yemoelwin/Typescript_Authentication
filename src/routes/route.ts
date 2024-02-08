import express from 'express';

import authenticationRoute from './authenticationRoute';
import userRoute from './userRoute';

const router = express.Router();

export default (): express.Router => {
  authenticationRoute(router);
  userRoute(router);
  return router;
};
