import { Test, TestingModule } from '@nestjs/testing';
import { LikesService } from './likes.service';
import { LikesRepository } from '../../../lib/repositories/likes/likes.repository';
import { PostsRepository } from '../../../lib/repositories/posts/post.repository';
import { CommentsRepository } from '../../../lib/repositories/comments/comments.repository';
import { AddLikeDto } from '../dto/request/add-like.dto';

describe('LikesService', () => {
  let service: LikesService;
  let likeRepository: LikesRepository;
  let postRepo: PostsRepository;
  let commentRepo: CommentsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        {
          provide: LikesRepository,
          useValue: {
            addLike: jest.fn(),
            findLikesByPostId: jest.fn(),
            findLikesByCommentId: jest.fn(),
            findLikesById: jest.fn(),
          },
        },
        {
          provide: PostsRepository,
          useValue: {
            addLikeToPost: jest.fn(),
          },
        },
        {
          provide: CommentsRepository,
          useValue: {
            addLikeToComment: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LikesService>(LikesService);
    likeRepository = module.get<LikesRepository>(LikesRepository);
    postRepo = module.get<PostsRepository>(PostsRepository);
    commentRepo = module.get<CommentsRepository>(CommentsRepository);
  });

  describe('addLike', () => {
    it('should add a like to a post', async () => {
      const addLikeDto: AddLikeDto = { user_id: 'user1', post_id: 'post1' };
      const mockLike = { _id: 'like1', user_id: 'user1', post_id: 'post1' };

      jest.spyOn(likeRepository, 'addLike').mockResolvedValue(mockLike as any);
      jest.spyOn(postRepo, 'addLikeToPost').mockResolvedValue(undefined);

      const result = await service.addLike(addLikeDto);

      expect(likeRepository.addLike).toHaveBeenCalledWith(addLikeDto);
      expect(postRepo.addLikeToPost).toHaveBeenCalled();
      expect(commentRepo.addLikeToComment).not.toHaveBeenCalled();
      expect(result).toEqual({
        id: 'like1',
        user_id: 'user1',
        post_id: 'post1',
        comment_id: undefined,
      });
    });

    it('should add a like to a comment', async () => {
      const addLikeDto: AddLikeDto = {
        user_id: 'user1',
        comment_id: 'comment1',
      };
      const mockLike = {
        _id: 'like1',
        user_id: 'user1',
        comment_id: 'comment1',
      };

      jest.spyOn(likeRepository, 'addLike').mockResolvedValue(mockLike as any);
      jest.spyOn(commentRepo, 'addLikeToComment').mockResolvedValue(undefined);

      const result = await service.addLike(addLikeDto);

      expect(likeRepository.addLike).toHaveBeenCalledWith(addLikeDto);
      expect(commentRepo.addLikeToComment).toHaveBeenCalled();
      expect(postRepo.addLikeToPost).not.toHaveBeenCalled();
      expect(result).toEqual({
        id: 'like1',
        user_id: 'user1',
        post_id: undefined,
        comment_id: 'comment1',
      });
    });

    it('should add a like to both post and comment', async () => {
      const addLikeDto: AddLikeDto = {
        user_id: 'user1',
        post_id: 'post1',
        comment_id: 'comment1',
      };
      const mockLike = {
        _id: 'like1',
        user_id: 'user1',
        post_id: 'post1',
        comment_id: 'comment1',
      };

      jest.spyOn(likeRepository, 'addLike').mockResolvedValue(mockLike as any);
      jest.spyOn(postRepo, 'addLikeToPost').mockResolvedValue(undefined);
      jest.spyOn(commentRepo, 'addLikeToComment').mockResolvedValue(undefined);

      const result = await service.addLike(addLikeDto);

      expect(likeRepository.addLike).toHaveBeenCalledWith(addLikeDto);
      expect(postRepo.addLikeToPost).toHaveBeenCalled();
      expect(commentRepo.addLikeToComment).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'like1',
        user_id: 'user1',
        post_id: 'post1',
        comment_id: 'comment1',
      });
    });
  });

  describe('getLikesByPostId', () => {
    it('should return likes for a post', async () => {
      const mockLikes = [{ user_id: 'user1' }, { user_id: 'user2' }];
      jest
        .spyOn(likeRepository, 'findLikesByPostId')
        .mockResolvedValue(mockLikes as any);

      const result = await service.getLikesByPostId('post1');

      expect(likeRepository.findLikesByPostId).toHaveBeenCalledWith('post1');
      expect(result).toEqual(mockLikes);
    });

    it('should return an empty array when there are no likes for a post', async () => {
      jest.spyOn(likeRepository, 'findLikesByPostId').mockResolvedValue([]);

      const result = await service.getLikesByPostId('post1');

      expect(likeRepository.findLikesByPostId).toHaveBeenCalledWith('post1');
      expect(result).toEqual([]);
    });
  });

  describe('getLikesByCommentId', () => {
    it('should return likes for a comment', async () => {
      const mockLikes = [{ user_id: 'user1' }, { user_id: 'user2' }];
      jest
        .spyOn(likeRepository, 'findLikesByCommentId')
        .mockResolvedValue(mockLikes as any);

      const result = await service.getLikesByCommentId('comment1');

      expect(likeRepository.findLikesByCommentId).toHaveBeenCalledWith(
        'comment1',
      );
      expect(result).toEqual(mockLikes);
    });

    it('should return an empty array when there are no likes for a comment', async () => {
      jest.spyOn(likeRepository, 'findLikesByCommentId').mockResolvedValue([]);

      const result = await service.getLikesByCommentId('comment1');

      expect(likeRepository.findLikesByCommentId).toHaveBeenCalledWith(
        'comment1',
      );
      expect(result).toEqual([]);
    });
  });

  describe('getLikeById', () => {
    it('should return a like by its id', async () => {
      const mockLike = {
        _id: 'like1',
        user_id: 'user1',
        post_id: 'post1',
        comment_id: 'comment1',
      };
      jest
        .spyOn(likeRepository, 'findLikesById')
        .mockResolvedValue(mockLike as any);

      const result = await service.getLikeById('like1');

      expect(likeRepository.findLikesById).toHaveBeenCalledWith('like1');
      expect(result).toEqual({
        id: 'like1',
        user_id: 'user1',
        post_id: 'post1',
        comment_id: 'comment1',
      });
    });

    it('should throw an error when like is not found', async () => {
      jest.spyOn(likeRepository, 'findLikesById').mockResolvedValue(null);

      await expect(
        service.getLikeById('invalid_like_id'),
      ).rejects.toThrowError();
    });
  });
});
