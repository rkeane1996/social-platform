import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Likes, LikesDocument } from '../schemas/likes.schema';
import { AddLikeDto } from '../../../src/likes/dto/request/add-like.dto';

export class LikesRepository {
  constructor(
    @InjectModel(Likes.name)
    private readonly likesModel: Model<LikesDocument>,
  ) {}

  async addLike(entity: AddLikeDto) {
    return await this.likesModel.create(entity);
  }

  async findLikesById(likeId: string) {
    return this.likesModel.find({ _id: likeId }).lean();
  }

  async findLikesByPostId(postId: string) {
    return this.likesModel.find({ post_id: postId }).lean();
  }

  async findLikesByCommentId(commentId: string) {
    return this.likesModel.find({ comment_id: commentId }).lean();
  }

}
