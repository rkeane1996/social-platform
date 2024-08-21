import { Injectable } from '@nestjs/common';
import { LikesRepository } from '../../../lib/repositories/likes/likes.repository';
import { AddLikeDto } from '../dto/request/add-like.dto';
import { ILikes } from '../dto/response/like.interface';
import { PostsRepository } from '../../../lib/repositories/posts/post.repository';
import { CommentsRepository } from '../../../lib/repositories/comments/comments.repository';
import { ILikesResponse } from '../dto/response/get-likes-response.interface';

@Injectable()
export class LikesService {
  constructor(
    private readonly likeRepository: LikesRepository,
    private readonly postRepo: PostsRepository,
    private readonly commentRepo: CommentsRepository,
  ) {}

  async addLike(addLikeDto: AddLikeDto) {
    const likeAdded = await this.likeRepository.addLike(addLikeDto);
    if (addLikeDto.post_id) {
      await this.postRepo.addLikeToPost(addLikeDto.post_id, likeAdded.id);
    }
    if (addLikeDto.comment_id) {
      await this.commentRepo.addLikeToComment(
        addLikeDto.comment_id,
        likeAdded.id,
      );
    }
    return this.formatLike(likeAdded);
  }

  async getLikesByPostId(postId: string): Promise<ILikesResponse[]> {
    const likes = (await this.likeRepository.findLikesByPostId(postId)) || [];

    return likes.map((like) => this.formatLikeResponse(like));
  }

  async getLikesByCommentId(commentId: string): Promise<ILikesResponse[]> {
    const likes =
      (await this.likeRepository.findLikesByCommentId(commentId)) || [];

    return likes.map((like) => this.formatLikeResponse(like));
  }

  async getLikeById(likeId: string): Promise<ILikes> {
    const like = await this.likeRepository.findLikesById(likeId);
    return this.formatLike(like);
  }

  private formatLikeResponse(like): ILikesResponse {
    return {
      user_id: like.user_id,
    };
  }

  private formatLike(like): ILikes {
    return {
      id: like._id,
      user_id: like.user_id,
      post_id: like.post_id,
      comment_id: like.comment_id,
    };
  }
}
