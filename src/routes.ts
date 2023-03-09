import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import apiSpec from '../swagger-doc.json';

import * as BookController from './controllers/book';
import * as UserController from './controllers/user';
import * as AuthController from './controllers/auth';
import envConfig from './config/config';

import memCache from './providers/cache';

export const router = Router();

// Auth routes
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

// Book routes
router.post('/book/add', BookController.add);
router.get('/book/all', BookController.all);
router.get('/book/search', BookController.search);

// User routes
router.get('/user/all', memCache.cache(30), UserController.all);

if (envConfig.NODE_ENV === 'development') {
  router.use('/dev/api-docs', swaggerUi.serve);
  router.get('/dev/api-docs', swaggerUi.setup(apiSpec));
}
