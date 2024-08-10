import { Injectable } from '@nestjs/common';
import { LikesRepository } from '../repository/likes.repository';
import { AddLikeDto } from '../dto/request/add-like.dto';
import { ILikes } from '../dto/response/get-like.interface';

@Injectable()
export class LikesService {
  constructor(private readonly likeRepository: LikesRepository) {}

  async addLike(addLikeDto: AddLikeDto): Promise<ILikes> {
    return await this.likeRepository.addLike(addLikeDto);
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
