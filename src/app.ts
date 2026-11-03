import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { corsOptions } from './config/cors';
import { swaggerSpec } from './config/swagger';
import { requestLogger } from './middleware/request-logger';
import { notFoundHandler } from './middleware/not-found';
import { errorHandler } from './middleware/error-handler';
import { rootRouter } from './routes';

export const createApp = (): Express => {
  const app = express();

  // Security & Utility Middleware
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(requestLogger);

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'UP',
      service: 'PanelSphere Backend API',
      timestamp: new Date().toISOString(),
    });
  });

  // Swagger Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Main API Router
  app.use('/api/v1', rootRouter);

  // 404 & Global Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

