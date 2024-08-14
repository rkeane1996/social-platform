import { Module } from '@nestjs/common';
import { UsersService } from './service/users.service';
import { UsersController } from './controller/users.controller';
import { RepositoriesModule } from 'lib/repositories/repositories.module';

@Module({
  imports: [RepositoriesModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
