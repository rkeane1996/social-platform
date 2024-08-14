import { Module } from '@nestjs/common';
import { CommentsRepository } from './comments/comments.repository';
import { LikesRepository } from './likes/likes.repository';
import { PostsRepository } from './posts/post.repository';
import { UsersRepository } from './users/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Comments, CommentsSchema } from './schemas/comments.schema';
import { Likes, LikesSchema } from './schemas/likes.schema';
import { Posts, PostsSchema } from './schemas/posts.schema';
import { Users, UsersSchema } from './schemas/users.schema';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Likes.name, schema: LikesSchema }]),
      MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
      MongooseModule.forFeature([{ name: Comments.name, schema: CommentsSchema }]),
      MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    ],
    providers: [
      LikesRepository,
      PostsRepository,
      CommentsRepository,
      UsersRepository,
    ],
    exports: [
      LikesRepository,
      PostsRepository,
      CommentsRepository,
      UsersRepository,
    ],
  })
  export class RepositoriesModule {}
