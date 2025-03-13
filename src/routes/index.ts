import { Router } from 'express';
import authRoutes from './auth.routes';
import publicationRoutes from './publication.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/publications', publicationRoutes);

export default router; 