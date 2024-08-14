import { Injectable } from '@nestjs/common';
import { LikesRepository } from '../../../lib/repositories/likes/likes.repository';
import { AddLikeDto } from '../dto/request/add-like.dto';
import { ILikes } from '../dto/response/get-like.interface';
import { PostsRepository } from '../../../lib/repositories/posts/post.repository';
import { CommentsRepository } from '../../../lib/repositories/comments/comments.repository';

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
    return likeAdded as ILikes;
  }

  async getLikesByPostId(postId: string): Promise<ILikes[]> {
    return await this.likeRepository.findLikesByPostId(postId);
  }

  async getLikesByCommentId(commentId: string): Promise<ILikes[]> {
    return await this.likeRepository.findLikesByCommentId(commentId);
  }

  async getLikeById(likeId: string): Promise<ILikes> {
    return await this.likeRepository.findLikesById(likeId);
  }
}
