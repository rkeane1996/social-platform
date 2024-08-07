import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../repository/post.repository';
import { IPosts } from '../dto/response/get-posts-response.interface';
import { CreatePostsDto } from '../dto/request/create-posts-response.dto';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepo: PostsRepository) {}

  async getUsersPosts(userId: string): Promise<IPosts[]> {
    return await this.postsRepo.findUsersPosts(userId);
  }

  async createPost(requestBody: CreatePostsDto) {
    return await this.postsRepo.createPost(requestBody);
  }
}
