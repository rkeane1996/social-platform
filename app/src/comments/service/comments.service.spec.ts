import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { CommentsRepository } from '../../../lib/repositories/comments/comments.repository';
import { PostsRepository } from '../../../lib/repositories/posts/post.repository';
import { AddCommentDto } from '../dto/request/add-comment.dto';
import { IComment } from '../dto/repsonse/comment.interface';

// Mock Data
const mockComment: IComment = {
  id: '1',
  post_id: 'post1',
  user_id: 'user1',
  text: 'This is a comment',
  created_at: new Date(),
  likes: [],
};

const mockComments: IComment[] = [mockComment];

describe('CommentsService', () => {
  let commentsService: CommentsService;
  let commentsRepository: CommentsRepository;
  let postsRepository: PostsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: CommentsRepository,
          useValue: {
            createComment: jest.fn().mockResolvedValue(mockComment),
            getCommentsByPostId: jest.fn().mockResolvedValue(mockComments),
          },
        },
        {
          provide: PostsRepository,
          useValue: {
            addCommentToPost: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    commentsService = module.get<CommentsService>(CommentsService);
    commentsRepository = module.get<CommentsRepository>(CommentsRepository);
    postsRepository = module.get<PostsRepository>(PostsRepository);
  });

  it('should be defined', () => {
    expect(commentsService).toBeDefined();
  });

  describe('addComment', () => {
    it('should successfully add a comment and associate it with a post', async () => {
      const dto: AddCommentDto = {
        post_id: 'post1',
        user_id: 'user1',
        text: 'This is a comment',
      };

      const result = await commentsService.addComment(dto);
      expect(result).toEqual(mockComment);
      expect(commentsRepository.createComment).toHaveBeenCalledWith(dto);
      expect(postsRepository.addCommentToPost).toHaveBeenCalledWith(
        mockComment.post_id,
        mockComment.id,
      );
    });

    it('should handle a failure in creating a comment', async () => {
      jest
        .spyOn(commentsRepository, 'createComment')
        .mockRejectedValueOnce(new Error('Failed to create comment'));

      const dto: AddCommentDto = {
        post_id: 'post1',
        user_id: 'user1',
        text: 'This is a comment',
      };

      await expect(commentsService.addComment(dto)).rejects.toThrowError(
        'Failed to create comment',
      );
      expect(postsRepository.addCommentToPost).not.toHaveBeenCalled();
    });

    it('should handle a failure in associating the comment with a post', async () => {
      jest
        .spyOn(postsRepository, 'addCommentToPost')
        .mockRejectedValueOnce(new Error('Failed to add comment to post'));

      const dto: AddCommentDto = {
        post_id: 'post1',
        user_id: 'user1',
        text: 'This is a comment',
      };

      await expect(commentsService.addComment(dto)).rejects.toThrowError(
        'Failed to add comment to post',
      );
      expect(commentsRepository.createComment).toHaveBeenCalledWith(dto);
    });
  });

  describe('getPostComments', () => {
    it('should return a list of comments for a post', async () => {
      const postId = 'post1';

      const result = await commentsService.getPostComments(postId);
      expect(result).toEqual(mockComments);
      expect(commentsRepository.getCommentsByPostId).toHaveBeenCalledWith(
        postId,
      );
    });

    it('should return an empty array if no comments are found', async () => {
      jest
        .spyOn(commentsRepository, 'getCommentsByPostId')
        .mockResolvedValueOnce([]);

      const postId = 'post1';

      const result = await commentsService.getPostComments(postId);
      expect(result).toEqual([]);
      expect(commentsRepository.getCommentsByPostId).toHaveBeenCalledWith(
        postId,
      );
    });

    it('should handle a failure in fetching comments', async () => {
      jest
        .spyOn(commentsRepository, 'getCommentsByPostId')
        .mockRejectedValueOnce(new Error('Failed to fetch comments'));

      const postId = 'post1';

      await expect(
        commentsService.getPostComments(postId),
      ).rejects.toThrowError('Failed to fetch comments');
    });
  });
});
