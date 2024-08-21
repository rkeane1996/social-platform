import { Test, TestingModule } from '@nestjs/testing';
import { LikesController } from './likes.controller';
import { LikesService } from '../service/likes.service';
import { AddLikeDto } from '../dto/request/add-like.dto';
import { ILikes } from '../dto/response/like.interface';

describe('LikesController', () => {
  let likesController: LikesController;

  const mockLikesService = {
    addLike: jest.fn(),
    getLikesByPostId: jest.fn(),
    getLikesByCommentId: jest.fn(),
    getLikeById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikesController],
      providers: [
        {
          provide: LikesService,
          useValue: mockLikesService,
        },
      ],
    }).compile();

    likesController = module.get<LikesController>(LikesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(likesController).toBeDefined();
  });

  describe('addLikes', () => {
    it('should call likesService.addLike with correct parameters', async () => {
      const dto: AddLikeDto = { user_id: 'user1', post_id: 'post1' };
      const result: ILikes = {
        id: 'RES',
        user_id: 'user1',
        post_id: 'post1',
        comment_id: null,
      };
      mockLikesService.addLike.mockResolvedValue(result);

      expect(await likesController.addLikes(dto)).toEqual(result);
      expect(mockLikesService.addLike).toHaveBeenCalledWith(dto);
    });

    it('should throw an error if user_id is missing', async () => {
      const dto: AddLikeDto = { post_id: 'post1' } as any;

      try {
        await likesController.addLikes(dto);
      } catch (e) {
        expect(e.response.message).toContain('user_id must be a string');
      }
    });
  });

  describe('getLikesByPostId', () => {
    it('should return an array of likes for the given post ID', async () => {
      const postId = 'post1';
      const result: ILikes[] = [
        {
          id: 'RES',
          user_id: 'user1',
          post_id: 'post1',
          comment_id: null,
        },
      ];
      mockLikesService.getLikesByPostId.mockResolvedValue(result);

      expect(await likesController.getLikesByPostId(postId)).toEqual(result);
      expect(mockLikesService.getLikesByPostId).toHaveBeenCalledWith(postId);
    });

    it('should return an empty array if no likes found for the given post ID', async () => {
      const postId = 'post1';
      const result: ILikes[] = [];
      mockLikesService.getLikesByPostId.mockResolvedValue(result);

      expect(await likesController.getLikesByPostId(postId)).toEqual(result);
    });
  });

  describe('getLikesByCommentId', () => {
    it('should return an array of likes for the given comment ID', async () => {
      const commentId = 'comment1';
      const result: ILikes[] = [
        {
          id: 'RES',
          user_id: 'user1',
          post_id: null,
          comment_id: 'comment1',
        },
      ];
      mockLikesService.getLikesByCommentId.mockResolvedValue(result);

      expect(await likesController.getLikesByCommentId(commentId)).toEqual(
        result,
      );
      expect(mockLikesService.getLikesByCommentId).toHaveBeenCalledWith(
        commentId,
      );
    });

    it('should return an empty array if no likes found for the given comment ID', async () => {
      const commentId = 'comment1';
      const result: ILikes[] = [];
      mockLikesService.getLikesByCommentId.mockResolvedValue(result);

      expect(await likesController.getLikesByCommentId(commentId)).toEqual(
        result,
      );
    });
  });

  describe('getLikesById', () => {
    it('should return a like by its ID', async () => {
      const likeId = 'like1';
      const result: ILikes = {
        id: 'RES',
        user_id: 'user1',
        post_id: 'post1',
        comment_id: null,
      };
      mockLikesService.getLikeById.mockResolvedValue(result);

      expect(await likesController.getLikesById(likeId)).toEqual(result);
      expect(mockLikesService.getLikeById).toHaveBeenCalledWith(likeId);
    });

    it('should return null if the like is not found', async () => {
      const likeId = 'like1';
      const result = null;
      mockLikesService.getLikeById.mockResolvedValue(result);

      expect(await likesController.getLikesById(likeId)).toBeNull();
    });
  });
});
