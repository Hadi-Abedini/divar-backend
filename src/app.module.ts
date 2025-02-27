import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DatabaseModule,AuthModule,UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
