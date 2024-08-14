import { Test, TestingModule } from '@nestjs/testing';
import { LikesService } from './likes.service';
import { LikesRepository } from '../../../lib/repositories/likes/likes.repository';
import { PostsRepository } from '../../../lib/repositories/posts/post.repository';
import { CommentsRepository } from '../../../lib/repositories/comments/comments.repository';
import { AddLikeDto } from '../dto/request/add-like.dto';
import { ILikes } from '../dto/response/get-like.interface';

// Mock data
const mockLike: ILikes = {
  id: 'like1',
  user_id: 'user1',
  post_id: 'post1',
  comment_id: null,
  created_at: new Date(),
};

const mockLikes: ILikes[] = [mockLike];

describe('LikesService', () => {
  let likesService: LikesService;
  let likesRepository: LikesRepository;
  let postsRepository: PostsRepository;
  let commentsRepository: CommentsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        {
          provide: LikesRepository,
          useValue: {
            addLike: jest.fn().mockResolvedValue(mockLike),
            findLikesByPostId: jest.fn().mockResolvedValue(mockLikes),
            findLikesByCommentId: jest.fn().mockResolvedValue(mockLikes),
            findLikesById: jest.fn().mockResolvedValue(mockLike),
          },
        },
        {
          provide: PostsRepository,
          useValue: {
            addLikeToPost: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: CommentsRepository,
          useValue: {
            addLikeToComment: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    likesService = module.get<LikesService>(LikesService);
    likesRepository = module.get<LikesRepository>(LikesRepository);
    postsRepository = module.get<PostsRepository>(PostsRepository);
    commentsRepository = module.get<CommentsRepository>(CommentsRepository);
  });

  it('should be defined', () => {
    expect(likesService).toBeDefined();
  });

  describe('addLike', () => {
    it('should add a like to a post', async () => {
      const dto: AddLikeDto = { user_id: 'user1', post_id: 'post1' };

      const result = await likesService.addLike(dto);

      expect(result).toEqual(mockLike);
      expect(likesRepository.addLike).toHaveBeenCalledWith(dto);
      expect(postsRepository.addLikeToPost).toHaveBeenCalledWith(
        'post1',
        mockLike.id,
      );
      expect(commentsRepository.addLikeToComment).not.toHaveBeenCalled();
    });

    it('should add a like to a comment', async () => {
      const dto: AddLikeDto = { user_id: 'user1', comment_id: 'comment1' };

      const result = await likesService.addLike(dto);

      expect(result).toEqual(mockLike);
      expect(likesRepository.addLike).toHaveBeenCalledWith(dto);
      expect(commentsRepository.addLikeToComment).toHaveBeenCalledWith(
        'comment1',
        mockLike.id,
      );
      expect(postsRepository.addLikeToPost).not.toHaveBeenCalled();
    });

    it('should handle adding a like to both a post and a comment', async () => {
      const dto: AddLikeDto = {
        user_id: 'user1',
        post_id: 'post1',
        comment_id: 'comment1',
      };

      const result = await likesService.addLike(dto);

      expect(result).toEqual(mockLike);
      expect(likesRepository.addLike).toHaveBeenCalledWith(dto);
      expect(postsRepository.addLikeToPost).toHaveBeenCalledWith(
        'post1',
        mockLike.id,
      );
      expect(commentsRepository.addLikeToComment).toHaveBeenCalledWith(
        'comment1',
        mockLike.id,
      );
    });

    it('should handle a failure in adding a like to a post', async () => {
      jest
        .spyOn(postsRepository, 'addLikeToPost')
        .mockRejectedValueOnce(new Error('Failed to add like to post'));

      const dto: AddLikeDto = { user_id: 'user1', post_id: 'post1' };

      await expect(likesService.addLike(dto)).rejects.toThrow(
        'Failed to add like to post',
      );
    });

    it('should handle a failure in adding a like to a comment', async () => {
      jest
        .spyOn(commentsRepository, 'addLikeToComment')
        .mockRejectedValueOnce(new Error('Failed to add like to comment'));

      const dto: AddLikeDto = { user_id: 'user1', comment_id: 'comment1' };

      await expect(likesService.addLike(dto)).rejects.toThrow(
        'Failed to add like to comment',
      );
    });
  });

  describe('getLikesByPostId', () => {
    it('should return a list of likes for a post', async () => {
      const postId = 'post1';

      const result = await likesService.getLikesByPostId(postId);

      expect(result).toEqual(mockLikes);
      expect(likesRepository.findLikesByPostId).toHaveBeenCalledWith(postId);
    });

    it('should return an empty array if no likes are found for a post', async () => {
      jest
        .spyOn(likesRepository, 'findLikesByPostId')
        .mockResolvedValueOnce([]);

      const postId = 'post1';

      const result = await likesService.getLikesByPostId(postId);

      expect(result).toEqual([]);
      expect(likesRepository.findLikesByPostId).toHaveBeenCalledWith(postId);
    });

    it('should handle a failure in fetching likes for a post', async () => {
      jest
        .spyOn(likesRepository, 'findLikesByPostId')
        .mockRejectedValueOnce(new Error('Failed to fetch likes for post'));

      const postId = 'post1';

      await expect(likesService.getLikesByPostId(postId)).rejects.toThrowError(
        'Failed to fetch likes for post',
      );
    });
  });

  describe('getLikesByCommentId', () => {
    it('should return a list of likes for a comment', async () => {
      const commentId = 'comment1';

      const result = await likesService.getLikesByCommentId(commentId);

      expect(result).toEqual(mockLikes);
      expect(likesRepository.findLikesByCommentId).toHaveBeenCalledWith(
        commentId,
      );
    });

    it('should return an empty array if no likes are found for a comment', async () => {
      jest
        .spyOn(likesRepository, 'findLikesByCommentId')
        .mockResolvedValueOnce([]);

      const commentId = 'comment1';

      const result = await likesService.getLikesByCommentId(commentId);

      expect(result).toEqual([]);
      expect(likesRepository.findLikesByCommentId).toHaveBeenCalledWith(
        commentId,
      );
    });

    it('should handle a failure in fetching likes for a comment', async () => {
      jest
        .spyOn(likesRepository, 'findLikesByCommentId')
        .mockRejectedValueOnce(new Error('Failed to fetch likes for comment'));

      const commentId = 'comment1';

      await expect(
        likesService.getLikesByCommentId(commentId),
      ).rejects.toThrowError('Failed to fetch likes for comment');
    });
  });

  describe('getLikeById', () => {
    it('should return a like by its ID', async () => {
      const likeId = 'like1';

      const result = await likesService.getLikeById(likeId);

      expect(result).toEqual(mockLike);
      expect(likesRepository.findLikesById).toHaveBeenCalledWith(likeId);
    });

    it('should handle a failure in fetching a like by its ID', async () => {
      jest
        .spyOn(likesRepository, 'findLikesById')
        .mockRejectedValueOnce(new Error('Failed to fetch like by ID'));

      const likeId = 'like1';

      await expect(likesService.getLikeById(likeId)).rejects.toThrowError(
        'Failed to fetch like by ID',
      );
    });

    it('should return null if no like is found by its ID', async () => {
      jest.spyOn(likesRepository, 'findLikesById').mockResolvedValueOnce(null);

      const likeId = 'like1';

      const result = await likesService.getLikeById(likeId);

      expect(result).toBeNull();
      expect(likesRepository.findLikesById).toHaveBeenCalledWith(likeId);
    });
  });
});
