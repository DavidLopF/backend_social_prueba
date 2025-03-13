import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './configs/swagger.config';
import { seedUsers } from './seeders/user.seeder';
import { success, printError } from './utils/logger';
import authRoutes from './routes/auth.routes';
import publicationRoutes from './routes/publication.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/auth', authRoutes);
app.use('/publications', publicationRoutes);

// Start server
app.listen(PORT, async () => {
  try {
    success(`Server running on port ${PORT}`);
    
    // Execute seeders
    await seedUsers();
    success('Seeders executed successfully');
  } catch (error) {
    printError('Error starting server: ' + error);
  }
});
