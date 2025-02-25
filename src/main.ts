import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const userService = app.get(UserService);
  
  const adminExists = await userService.isAdminExists();
  
  if (!adminExists) {
    await userService.createAdminUser();
  }

  const config = new DocumentBuilder()
  .setTitle('API Documentation')
  .setDescription('Description of the API')
  .setVersion('1.0')
  .addTag('tags')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();