import { Hono } from 'hono';
import {
  AccountController,
  SessionController,
  UserController,
  VerificationController,
} from '../controllers';
import { authMiddleware, errorHandler, notFoundHandler } from '../middleware';

const userController = new UserController();
const accountController = new AccountController();
const sessionController = new SessionController();
const verificationController = new VerificationController();

const routes = new Hono();

routes.onError(errorHandler);
routes.notFound(notFoundHandler);
routes.use('/*', authMiddleware);

// Users routes
routes.get('/users', userController.listUsers());
routes.post('/users', userController.createUser());
routes.get('/users/:id', userController.findUser());
routes.put('/users/:id', userController.updateUser());
routes.delete('/users/:id', userController.deleteUser());

// Accounts routes
routes.get('/accounts', accountController.listAccounts());
routes.post('/accounts', accountController.createAccount());
routes.get('/accounts/:id', accountController.findAccount());
routes.put('/accounts/:id', accountController.updateAccount());
routes.delete('/accounts/:id', accountController.deleteAccount());

// Sessions routes
routes.get('/sessions', sessionController.listSessions());
routes.post('/sessions', sessionController.createSession());
routes.get('/sessions/:id', sessionController.findSession());
routes.put('/sessions/:id', sessionController.updateSession());
routes.delete('/sessions/:id', sessionController.deleteSession());

// Verifications routes
routes.get('/verifications', verificationController.listVerifications());
routes.post('/verifications', verificationController.createVerification());
routes.get('/verifications/:id', verificationController.findVerification());
routes.put('/verifications/:id', verificationController.updateVerification());
routes.delete(
  '/verifications/:id',
  verificationController.deleteVerification(),
);

export default routes;
