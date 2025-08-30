import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../app.module';

export async function generateDefaultAppBeforeEachSetup() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  await app.init();

  return { app };
}

export async function generateDefaultAppAfterEachSetup(app: INestApplication) {
  await app.close();
  jest.clearAllMocks();
}
