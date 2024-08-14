import { Module } from '@nestjs/common';
import { PostsService } from './service/posts.service';
import { PostsController } from './controller/posts.controller';
import {
  Posts,
  PostsSchema,
} from '../../lib/repositories/schemas/posts.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RepositoriesModule } from 'lib/repositories/repositories.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
    RepositoriesModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
