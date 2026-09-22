import { Router } from 'express';
import { monthlyController, pdfController, reportController } from '../controllers/report.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
const router = Router();
router.use(requireAuth);
router.get('/', reportController);
router.get('/monthly', monthlyController);
router.get('/pdf', pdfController);
export default router;
