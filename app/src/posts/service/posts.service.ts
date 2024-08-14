import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../../../lib/repositories/posts/post.repository';
import { IPosts } from '../dto/response/get-posts-response.interface';
import { CreatePostsDto } from '../dto/request/create-posts-response.dto';
import { UsersRepository } from '../../../lib/repositories/users/user.repository';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepo: PostsRepository,
    private readonly userRepo: UsersRepository,
  ) {}

  async getUsersPosts(userId: string): Promise<IPosts[]> {
    return await this.postsRepo.findUsersPosts(userId);
  }

  async createPost(requestBody: CreatePostsDto) {
    const postCreated = (await this.postsRepo.createPost(
      requestBody,
    )) as IPosts;
    await this.userRepo.addUserPosts(postCreated.user_id, postCreated.id);
    return postCreated;
  }
}
