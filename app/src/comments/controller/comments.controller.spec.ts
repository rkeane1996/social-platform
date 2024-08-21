import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from '../service/comments.service';
import { AddCommentDto } from '../dto/request/add-comment.dto';
import { GetPostCommentsQueryDto } from '../dto/request/get-post-comments.dto';
import { IComment } from '../dto/repsonse/comment.interface';

// Mock Data
const mockComment: IComment = {
  id: '1',
  post_id: 'post1',
  user_id: 'user1',
  text: 'This is a comment',
  likes: [],
};

const mockComments: IComment[] = [mockComment];

describe('CommentsController', () => {
  let commentsController: CommentsController;
  let commentsService: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: {
            addComment: jest.fn().mockResolvedValue(mockComment),
            getPostComments: jest.fn().mockResolvedValue(mockComments),
          },
        },
      ],
    }).compile();

    commentsController = module.get<CommentsController>(CommentsController);
    commentsService = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(commentsController).toBeDefined();
  });

  describe('addComment', () => {
    it('should add a comment', async () => {
      const dto: AddCommentDto = {
        post_id: 'post1',
        user_id: 'user1',
        text: 'This is a comment',
      };

      const result = await commentsController.addComment(dto);
      expect(result).toEqual(mockComment);
      expect(commentsService.addComment).toHaveBeenCalledWith(dto);
    });

    it('should handle errors during comment addition', async () => {
      jest
        .spyOn(commentsService, 'addComment')
        .mockRejectedValueOnce(new Error('Failed to add comment'));

      const dto: AddCommentDto = {
        post_id: 'post1',
        user_id: 'user1',
        text: 'This is a comment',
      };

      await expect(commentsController.addComment(dto)).rejects.toThrowError(
        'Failed to add comment',
      );
    });
  });

  describe('getPostComments', () => {
    it('should get comments for a post', async () => {
      const query: GetPostCommentsQueryDto = { postId: 'post1' };

      const result = await commentsController.getPostComments(query);
      expect(result).toEqual(mockComments);
      expect(commentsService.getPostComments).toHaveBeenCalledWith(
        query.postId,
      );
    });

    it('should handle errors during fetching post comments', async () => {
      jest
        .spyOn(commentsService, 'getPostComments')
        .mockRejectedValueOnce(new Error('Failed to fetch comments'));

      const query: GetPostCommentsQueryDto = { postId: 'post1' };

      await expect(
        commentsController.getPostComments(query),
      ).rejects.toThrowError('Failed to fetch comments');
    });
  });
});
