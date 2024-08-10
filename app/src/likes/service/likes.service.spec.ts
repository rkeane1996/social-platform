import { Test, TestingModule } from '@nestjs/testing';
import { LikesService } from './likes.service';
import { LikesRepository } from '../repository/likes.repository';
import { AddLikeDto } from '../dto/request/add-like.dto';
import { ILikes } from '../dto/response/get-like.interface';

describe('LikesService', () => {
  let likesService: LikesService;

  const mockLikesRepository = {
    addLike: jest.fn(),
    findLikesByPostId: jest.fn(),
    findLikesByCommentId: jest.fn(),
    findLikesById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        {
          provide: LikesRepository,
          useValue: mockLikesRepository,
        },
      ],
    }).compile();

    likesService = module.get<LikesService>(LikesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(likesService).toBeDefined();
  });

  describe('addLike', () => {
    it('should call likesRepository.addLike with correct parameters', async () => {
      const dto: AddLikeDto = { user_id: 'user1', post_id: 'post1' };
      const result: ILikes = {
        user_id: 'user1',
        post_id: 'post1',
        comment_id: null,
        created_at: new Date(),
      };

      mockLikesRepository.addLike.mockResolvedValue(result);

      expect(await likesService.addLike(dto)).toEqual(result);
      expect(mockLikesRepository.addLike).toHaveBeenCalledWith(dto);
    });

    it('should return the result from the repository', async () => {
      const dto: AddLikeDto = { user_id: 'user1', post_id: 'post1' };
      const result: ILikes = {
        user_id: 'user1',
        post_id: 'post1',
        comment_id: null,
        created_at: new Date(),
      };

      mockLikesRepository.addLike.mockResolvedValue(result);

      const serviceResult = await likesService.addLike(dto);
      expect(serviceResult).toEqual(result);
    });
  });

  describe('getLikesByPostId', () => {
    it('should call likesRepository.findLikesByPostId with correct postId', async () => {
      const postId = 'post1';
      const result: ILikes[] = [
        {
          user_id: 'user1',
          post_id: 'post1',
          comment_id: null,
          created_at: new Date(),
        },
      ];

      mockLikesRepository.findLikesByPostId.mockResolvedValue(result);

      expect(await likesService.getLikesByPostId(postId)).toEqual(result);
      expect(mockLikesRepository.findLikesByPostId).toHaveBeenCalledWith(
        postId,
      );
    });

    it('should return an empty array if no likes are found for the given post ID', async () => {
      const postId = 'post1';
      const result: ILikes[] = [];

      mockLikesRepository.findLikesByPostId.mockResolvedValue(result);

      const serviceResult = await likesService.getLikesByPostId(postId);
      expect(serviceResult).toEqual(result);
    });
  });

  describe('getLikesByCommentId', () => {
    it('should call likesRepository.findLikesByCommentId with correct commentId', async () => {
      const commentId = 'comment1';
      const result: ILikes[] = [
        {
          user_id: 'user1',
          post_id: null,
          comment_id: 'comment1',
          created_at: new Date(),
        },
      ];

      mockLikesRepository.findLikesByCommentId.mockResolvedValue(result);

      expect(await likesService.getLikesByCommentId(commentId)).toEqual(result);
      expect(mockLikesRepository.findLikesByCommentId).toHaveBeenCalledWith(
        commentId,
      );
    });

    it('should return an empty array if no likes are found for the given comment ID', async () => {
      const commentId = 'comment1';
      const result: ILikes[] = [];

      mockLikesRepository.findLikesByCommentId.mockResolvedValue(result);

      const serviceResult = await likesService.getLikesByCommentId(commentId);
      expect(serviceResult).toEqual(result);
    });
  });

  describe('getLikeById', () => {
    it('should call likesRepository.findLikesById with correct likeId', async () => {
      const likeId = 'like1';
      const result: ILikes = {
        user_id: 'user1',
        post_id: 'post1',
        comment_id: null,
        created_at: new Date(),
      };

      mockLikesRepository.findLikesById.mockResolvedValue(result);

      expect(await likesService.getLikeById(likeId)).toEqual(result);
      expect(mockLikesRepository.findLikesById).toHaveBeenCalledWith(likeId);
    });

    it('should return null if the like is not found', async () => {
      const likeId = 'like1';
      const result = null;

      mockLikesRepository.findLikesById.mockResolvedValue(result);

      const serviceResult = await likesService.getLikeById(likeId);
      expect(serviceResult).toBeNull();
    });
  });
});
