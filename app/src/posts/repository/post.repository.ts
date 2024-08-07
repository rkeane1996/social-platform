import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Posts, PostsDocument } from '../schema/posts.schema';
import { IPosts } from '../dto/response/get-posts-response.interface';
import { CreatePostsDto } from '../dto/request/create-posts-response.dto';

export class PostsRepository {
  constructor(
    @InjectModel(Posts.name)
    private readonly postsModel: Model<PostsDocument>,
  ) {}

  async findUsersPosts(userId: string): Promise<IPosts[]> {
    return await this.postsModel.find({ user_id: userId }).lean();
  }

  async createPost(entity: CreatePostsDto): Promise<IPosts> {
    return await this.postsModel.create(entity);
  }
}
