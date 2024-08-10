import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Likes, LikesDocument } from '../schema/likes.schema';
import { AddLikeDto } from '../dto/request/add-like.dto';
import { ILikes } from '../dto/response/get-like.interface';

export class LikesRepository {
  constructor(
    @InjectModel(Likes.name)
    private readonly likesModel: Model<LikesDocument>,
  ) {}

  async addLike(entity: AddLikeDto): Promise<ILikes> {
    return this.likesModel.create(entity);
  }

  async findLikesById(likeId: string): Promise<ILikes> {
    return this.likesModel.find({ _id: likeId }).lean();
  }

  async findLikesByPostId(postId: string): Promise<ILikes[]> {
    return this.likesModel.find({ post_id: postId }).lean();
  }

  async findLikesByCommentId(commentId: string): Promise<ILikes[]> {
    return this.likesModel.find({ comment_id: commentId }).lean();
  }
}
