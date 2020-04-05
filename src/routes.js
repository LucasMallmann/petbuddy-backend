import { Router } from 'express';
import multer from 'multer';

import AvatarController from './app/controllers/AvatarController';
import ForgotPasswordController from './app/controllers/ForgotPasswordController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.post('/users', UserController.store);

routes.post('/forgot-password', ForgotPasswordController.store);
routes.put('/forgot-password', ForgotPasswordController.update);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.post('/avatars', upload.single('file'), AvatarController.store);
routes.delete('/avatars/:id', AvatarController.delete);
routes.put('/avatars', AvatarController.update);

export default routes;
