import { InjectModel } from "@nestjs/mongoose";
import { Comments, CommentsDocument } from "../schemas/comments.schema";
import { Model } from "mongoose";
import { AddCommentDto } from "src/comments/dto/request/add-comment.dto";
import { IComment } from "src/comments/dto/repsonse/comment.interface";

export class CommentsRepository {
    constructor(
        @InjectModel(Comments.name)
        private readonly commentsModel: Model<CommentsDocument>,
      ) {}

      async createComment(entity: AddCommentDto): Promise<IComment> {
        return await this.commentsModel.create(entity);
      }

      async getCommentsByPostId(postId: string): Promise<IComment[]> {
        return await this.commentsModel.find({post_id: postId}).lean();
      }

      async addLikeToComment(commentId: string, likeId: string): Promise<IComment> {
        return await this.commentsModel.findOneAndUpdate(
          { _id: commentId },
          {
            $push: { likes: likeId },
          },
        );
      }
}