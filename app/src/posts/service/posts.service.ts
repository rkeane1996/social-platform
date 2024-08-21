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
    const usersPosts = (await this.postsRepo.findUsersPosts(userId)) || [];
    return usersPosts.map((posts) => this.formatPostResponse(posts));
  }

  async createPost(requestBody: CreatePostsDto): Promise<IPosts> {
    const postCreated = await this.postsRepo.createPost(requestBody);
    await this.userRepo.addUserPosts(postCreated.user_id, postCreated.id);
    return this.formatPostResponse(postCreated);
  }

  private formatPostResponse(post): IPosts {
    return {
      id: post._id,
      user_id: post.user_id,
      caption: post.caption,
      image_url: post.image_url,
      created_at: post.created_at,
      likes: post.likes,
      comments: post.comments,
    };
  }
}
