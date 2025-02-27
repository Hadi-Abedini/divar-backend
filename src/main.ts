import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import * as passport from 'passport';
import * as session from 'express-session';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(session({secret:process.env.JWT_SECRET || 'defaultSecret'}))
  app.use(passport.initialize());
  app.use(passport.session());

  const userService = app.get(UsersService);

  const adminExists = await userService.findUserAdmin();

  if (!adminExists) {
    await userService.createAdmin();
  }

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Description of the API')
    .setVersion('1.0')
    .addTag('tags')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
