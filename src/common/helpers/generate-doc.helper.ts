import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

import { HttpStatus, INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { apiResponses } from '../constants/swagger';

export function generateSwaggerDocumentation(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Sghss API')
    .setVersion('0.0.1')
    .addGlobalResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: apiResponses.internalServerErrorDefaultMessage,
    })
    .addBearerAuth(undefined, 'defaultBearerAuth')
    .addBearerAuth(undefined, 'refreshBearerAuth')
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme();
  const options = {
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
  };
  SwaggerModule.setup('api', app, document, options);
}
