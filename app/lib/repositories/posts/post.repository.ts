import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Posts, PostsDocument } from '../schemas/posts.schema';
import { IPosts } from '../../../src/posts/dto/response/get-posts-response.interface';
import { CreatePostsDto } from '../../../src/posts/dto/request/create-posts-response.dto';

export class PostsRepository {
  constructor(
    @InjectModel(Posts.name)
    private readonly postsModel: Model<PostsDocument>,
  ) {}

  async findUsersPosts(userId: string): Promise<IPosts[]> {
    return await this.postsModel.find({ user_id: userId }).lean();
  }

  async createPost(entity: CreatePostsDto) {
    return await this.postsModel.create(entity);
  }

  async addLikeToPost(postid: string, likeId: string) {
    return await this.postsModel.findOneAndUpdate(
      { _id: postid },
      {
        $push: { likes: likeId },
      },
    );
  }

  async addCommentToPost(postid: string, commentId: string) {
    return await this.postsModel.findOneAndUpdate(
      { _id: postid },
      {
        $push: { comments: commentId },
      },
    );
  }
}