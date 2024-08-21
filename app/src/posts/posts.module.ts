import { Module } from '@nestjs/common';
import { PostsService } from './service/posts.service';
import { PostsController } from './controller/posts.controller';
import { RepositoriesModule } from 'lib/repositories/repositories.module';

@Module({
  imports: [RepositoriesModule],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
