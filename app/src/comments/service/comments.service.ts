import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../../../lib/repositories/comments/comments.repository';
import { PostsRepository } from '../../../lib/repositories/posts/post.repository';
import { AddCommentDto } from '../dto/request/add-comment.dto';
import { IComment } from '../dto/repsonse/comment.interface';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepo: CommentsRepository,
    private readonly postRepo: PostsRepository,
  ) {}

  async addComment(request: AddCommentDto): Promise<IComment> {
    const commentAdded = await this.commentRepo.createComment(request);
    if (commentAdded) {
      await this.postRepo.addCommentToPost(
        commentAdded.post_id,
        commentAdded.id,
      );
    }
    return commentAdded;
  }

  async getPostComments(postId: string): Promise<IComment[]> {
    const comments = await this.commentRepo.getCommentsByPostId(postId);
    if (comments.length < 1) {
      return [];
    }
    return comments;
  }
}
