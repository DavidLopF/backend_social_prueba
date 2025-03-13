import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './configs/swagger.config';
import { seedUsers } from './seeders/user.seeder';
import authRoutes from './routes/auth.routes';
import publicationRoutes from './routes/publication.routes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/publications', publicationRoutes);

// Ejecutar seeder al iniciar la aplicación
seedUsers().catch(console.error);

export default app; 