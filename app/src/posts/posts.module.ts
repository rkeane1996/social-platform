import { Module } from '@nestjs/common';
import { PostsService } from './service/posts.service';
import { PostsController } from './controller/posts.controller';

@Module({
  providers: [PostsService],
  controllers: [PostsController]
})
export class PostsModule {}
