import { Module } from '@nestjs/common';
import { PostsService } from './service/posts.service';
import { PostsController } from './controller/posts.controller';
import { PostsRepository } from './repository/post.repository';
import { Posts, PostsSchema } from './schema/posts.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
  ],
  providers: [PostsService, PostsRepository],
  controllers: [PostsController],
})
export class PostsModule {}
