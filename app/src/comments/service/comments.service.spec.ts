import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { CommentsRepository } from '../../../lib/repositories/comments/comments.repository';
import { PostsRepository } from '../../../lib/repositories/posts/post.repository';
import { AddCommentDto } from '../dto/request/add-comment.dto';

describe('CommentsService', () => {
  let service: CommentsService;
  let commentsRepo: CommentsRepository;
  let postsRepo: PostsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: CommentsRepository,
          useValue: {
            createComment: jest.fn(),
            getCommentsByPostId: jest.fn(),
          },
        },
        {
          provide: PostsRepository,
          useValue: {
            addCommentToPost: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    commentsRepo = module.get<CommentsRepository>(CommentsRepository);
    postsRepo = module.get<PostsRepository>(PostsRepository);
  });

  describe('addComment', () => {
    it('should create a comment and add it to the post', async () => {
      const request: AddCommentDto = {
        post_id: 'post123',
        user_id: 'user123',
        text: 'This is a comment',
      };

      const mockComment = {
        _id: 'comment123',
        post_id: 'post123',
        user_id: 'user123',
        text: 'This is a comment',
        likes: [],
      };

      jest
        .spyOn(commentsRepo, 'createComment')
        .mockResolvedValue(mockComment as any);
      jest.spyOn(postsRepo, 'addCommentToPost').mockResolvedValue(null);

      const result = await service.addComment(request);

      expect(commentsRepo.createComment).toHaveBeenCalledWith(request);
      expect(postsRepo.addCommentToPost).toHaveBeenCalled();
      expect(result).toEqual({
        id: mockComment._id,
        post_id: mockComment.post_id,
        user_id: mockComment.user_id,
        text: mockComment.text,
        likes: [],
      });
    });
  });

  describe('getPostComments', () => {
    it('should return a list of formatted comments for a given post ID', async () => {
      const mockComments = [
        {
          _id: 'comment1',
          post_id: 'post123',
          user_id: 'user123',
          text: 'First comment',
          likes: [],
        },
        {
          _id: 'comment2',
          post_id: 'post123',
          user_id: 'user456',
          text: 'Second comment',
          likes: [],
        },
      ];

      jest
        .spyOn(commentsRepo, 'getCommentsByPostId')
        .mockResolvedValue(mockComments as any);

      const result = await service.getPostComments('post123');

      expect(result).toEqual([
        {
          id: 'comment1',
          post_id: 'post123',
          user_id: 'user123',
          text: 'First comment',
          likes: [],
        },
        {
          id: 'comment2',
          post_id: 'post123',
          user_id: 'user456',
          text: 'Second comment',
          likes: [],
        },
      ]);
    });

    it('should return an empty array if no comments are found', async () => {
      jest.spyOn(commentsRepo, 'getCommentsByPostId').mockResolvedValue([]);

      const result = await service.getPostComments('post123');

      expect(result).toEqual([]);
    });
  });
});
