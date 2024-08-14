import { Module } from '@nestjs/common';
import { CommentsController } from './controller/comments.controller';
import { CommentsService } from './service/comments.service';
import { RepositoriesModule } from '../../lib/repositories/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
