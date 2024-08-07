import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GetUserPostQueryDto } from '../dto/request/get-user-posts-query.dto';
import { PostsService } from '../service/posts.service';
import { IPosts } from '../dto/response/get-posts-response.interface';
import { CreatePostsDto } from '../dto/request/create-posts-response.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('user')
  async getUsersPost(@Query() query: GetUserPostQueryDto): Promise<IPosts[]> {
    return await this.postsService.getUsersPosts(query.userId);
  }

  @Post('create')
  async makePost(@Body() requestBody: CreatePostsDto): Promise<IPosts> {
    return await this.postsService.createPost(requestBody);
  }
}
