import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { generateSwaggerDocumentation } from './common/helpers/generate-doc.helper';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.enableCors();

  const port = config.get<number>('api.port') || 8080;
  const nodeEnv = config.get<string>('api.nodeEnv');

  if (nodeEnv !== 'production') {
    generateSwaggerDocumentation(app);
  }

  await app.listen(port, () => {
    logger.log(`Server listening at port ${port}`);
    logger.log(`Running in mode: ${nodeEnv}`);
  });
}

bootstrap();
