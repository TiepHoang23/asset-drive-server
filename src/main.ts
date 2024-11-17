import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('NestApplication');

  // Retrieve all routes registered in the application
  const server = app.getHttpAdapter();
  const router = server.getInstance()._router;

  if (router && router.stack) {
    const routes = router.stack
      .filter((layer) => layer.route) // Filter out middleware and other layers
      .map((layer) => ({
        path: layer.route.path,
        method: Object.keys(layer.route.methods)[0].toUpperCase(),
      }));

    // Log routes
    logger.log('Registered Routes:');
    routes.forEach((route) =>
      logger.log(`Method: ${route.method}, Path: ${route.path}`),
    );
  } else {
    logger.warn('No routes found or router stack unavailable.');
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
