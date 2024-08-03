import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { FollowsModule } from './follows/follows.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [UsersModule, PostsModule, CommentsModule, LikesModule, FollowsModule, NotificationsModule],

})
export class AppModule {}
