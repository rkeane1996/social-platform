import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { FollowsModule } from './follows/follows.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RepositoriesModule } from '../lib/repositories/repositories.module';
import 'dotenv/config';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    CommentsModule,
    LikesModule,
    FollowsModule,
    NotificationsModule,
    MongooseModule.forRoot(process.env.SP_DB_CONNECTION_STRING),
    RepositoriesModule,
  ],
})
export class AppModule {}
