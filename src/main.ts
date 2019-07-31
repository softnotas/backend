import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppPort, AppMode, AppPrefix, AppHost, AppName } from './modules/common/environment/environment';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  //const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule, 
    new FastifyAdapter({ logger: true }),
    {
      cors: true
    }
  );

  const logger = new Logger('HttpServer');

  const credentials = new DocumentBuilder()
  .setTitle('SoftNotas')
  .setDescription('El software SoftNotas para colegios le permite gestionar las notas y boletines desde cualquier lugar con acceso a internet.')
  .setVersion('0.1')
  .setLicense('Proprietary License','https://github.com/softnotas/backend/README.md')
  .setHost(`${AppHost}:${AppPort}`)
  .setContactEmail('davidnekocalderon@gmail.com')
  .setContactEmail('jualvalitube@gmail.com')
  .addTag('Notas')
  .addTag('Boletin')
  .addTag('Alumno')
  .addTag('Profesor')
  .addTag('Administrativo')
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app, credentials);

  SwaggerModule.setup('SoftNotas', app, document);

  app.enableCors();
  app.setGlobalPrefix('');
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(AppPort, ()=>{

    logger.log( (AppMode) ?
    `${AppName} => Server running on ${AppHost}:${AppPort}/${AppPrefix}/` : 
    `${AppName} => Modo Development => ${AppHost}:${AppPort}/${AppPrefix}/`);
  });
}
bootstrap();
