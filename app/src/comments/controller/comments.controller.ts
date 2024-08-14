import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommentsService } from '../service/comments.service';
import { AddCommentDto } from '../dto/request/add-comment.dto';
import { IComment } from '../dto/repsonse/comment.interface';
import { GetPostCommentsQueryDto } from '../dto/request/get-post-comments.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post('/add')
  async addComment(@Body() request: AddCommentDto): Promise<IComment> {
    return await this.commentService.addComment(request);
  }

  @Get('/post')
  async getPostComments(
    @Query() query: GetPostCommentsQueryDto,
  ): Promise<IComment[]> {
    return await this.commentService.getPostComments(query.postId);
  }
}
