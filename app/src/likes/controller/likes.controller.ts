import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LikesService } from '../service/likes.service';
import { AddLikeDto } from '../dto/request/add-like.dto';
import { ILikes } from '../dto/response/get-like.interface';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('add') //this add likes for a post or comment
  async addLikes(@Body() request: AddLikeDto): Promise<ILikes> {
    return await this.likesService.addLike(request);
  }

  @Get('post')
  async getLikesByPostId(@Query('postId') postId: string): Promise<ILikes[]> {
    return await this.likesService.getLikesByPostId(postId);
  }

  @Get('comment')
  async getLikesByCommentId(
    @Query('commentId') commentId: string,
  ): Promise<ILikes[]> {
    return await this.likesService.getLikesByCommentId(commentId);
  }

  @Get('')
  async getLikesById(@Query('id') likeId: string): Promise<ILikes> {
    return await this.likesService.getLikeById(likeId);
  }
}
