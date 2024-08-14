import { Module } from '@nestjs/common';
import { LikesController } from './controller/likes.controller';
import { LikesService } from './service/likes.service';
import { RepositoriesModule } from 'lib/repositories/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
