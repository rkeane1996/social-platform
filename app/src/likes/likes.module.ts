import { Module } from '@nestjs/common';
import { LikesController } from './controller/likes.controller';
import { LikesService } from './service/likes.service';
import { LikesRepository } from './repository/likes.repository';

@Module({
  controllers: [LikesController],
  providers: [LikesService, LikesRepository],
})
export class LikesModule {}
