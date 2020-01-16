import { Router } from 'express';
import multer from 'multer';

import AvatarController from './app/controllers/AvatarController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

const routes = Router();
const upload = multer(multerConfig);

routes.get('/sessions', SessionController.store);

routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.post('/avatars', upload.single('file'), AvatarController.store);

export default routes;
