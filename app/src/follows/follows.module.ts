import { Module } from '@nestjs/common';
import { FollowsController } from './controller/follows.controller';
import { FollowsService } from './service/follows.service';

@Module({
  controllers: [FollowsController],
  providers: [FollowsService]
})
export class FollowsModule {}
