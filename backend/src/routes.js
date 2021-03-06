import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlansController from './app/controllers/PlanController';
import EnrollController from './app/controllers/EnrollController';

import authMiddleware from './app/middlewares/auth';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AnswerController from './app/controllers/AnswerController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Routes Checkin
routes.get('/students/:id/checkins', CheckinController.index);
routes.post('/students/:id/checkins', CheckinController.store);

routes.get('/students/:id/help-orders', HelpOrderController.show);
routes.post('/students/:id/help-orders', HelpOrderController.store);

routes.use(authMiddleware);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

routes.put('/users/:id', UserController.update);

// Routes Plans
routes.get('/plans', PlansController.index);
routes.post('/plans', PlansController.store);
routes.put('/plans/:id', PlansController.update);
routes.delete('/plans/:id', PlansController.delete);

// Routes Enroll
routes.get('/enroll', EnrollController.index);
routes.post('/enroll', EnrollController.store);
routes.put('/enroll/:id', EnrollController.store);
routes.delete('/enroll/:id', EnrollController.store);

// Routes HelpOrder
routes.get('/students/help-orders', HelpOrderController.index);
routes.post('/help-orders/:id/answer', AnswerController.store);

export default routes;
