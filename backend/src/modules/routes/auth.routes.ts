import { Router } from 'express';
import { loginController, registerController } from '../controllers/auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { loginSchema, registerSchema } from '../../validators/schemas.js';
const router = Router();
router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);
export default router;
