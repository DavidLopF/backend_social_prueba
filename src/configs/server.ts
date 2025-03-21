import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { ROUTE_PREFIX, ROUTES } from ".";
import { getSingular } from "../utils/functions";
import { success } from "../utils/logger";
import colors from "colors";
import { Server as HttpServer } from "http";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

class Server {
  private app: Application;
  private port: string;
  private server: HttpServer | null = null;

  constructor() {
    colors.enable();
    this.app = express();
    this.port = process.env.PORT || "3000";
    this.middlewares();
    this.setupSwagger();
    this.routes();
    this.handleShutdown();
  }

  private middlewares():void {
    this.app.use(express.json());
    this.app.use(
      express.urlencoded({
        extended: false,
      })
    );
    this.app.use(cors());
    this.app.options("*", cors());
    this.app.use(morgan("dev"));
    this.app.get("/", (_req, res) => {
      res.status(200).json({
        message: "API is running",
        documentation: '/api-docs'
      });
    });
  }

  private setupSwagger():void {
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Social Network API',
          version: '1.0.0',
          description: 'API documentation for Social Network',
        },
        servers: [
          {
            url: '/api',
            description: 'API Server'
          }
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
      apis: [path.join(__dirname, '../routes/*.ts'), path.join(__dirname, '../routes/*.js')],
    };

    const specs = swaggerJSDoc(swaggerOptions);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,
      }
    }));
  }

  private routes(): void {
    ROUTES.forEach(async (route) => {
      const routeModule = await import(
        `../routes/${getSingular(route)}.routes`
      );

      if (process.env.ENVIROMENT == "DEV") {
        success(`Loading route ${route}`);
      }

      this.app.use(`${ROUTE_PREFIX}/${route}`, routeModule.default);
    });
  }

  private handleShutdown(): void {
    process.on('SIGTERM', () => this.gracefulShutdown());
    process.on('SIGINT', () => this.gracefulShutdown());
  }

  private gracefulShutdown(): void {
    if (this.server) {
      this.server.close(() => {
        console.log('Server closed gracefully');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  }

  public listen(): void {
    this.server = this.app.listen(this.port, () => {
      success(`Server running on port ${this.port}`);
    });

    this.server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${this.port} is already in use`);
        process.exit(1);
      }
    });
  }
}

export default new Server();
