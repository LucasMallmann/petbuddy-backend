import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middlewares/auth';

const routes = Router();

routes.get('/sessions', SessionController.store);

routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

export default routes;
