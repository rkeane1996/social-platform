import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PostsRepository } from '../repository/post.repository';
import { IPosts } from '../dto/response/get-posts-response.interface';
import { CreatePostsDto } from '../dto/request/create-posts-response.dto';

describe('PostsService', () => {
  let postsService: PostsService;

  const mockPostsRepository = {
    findUsersPosts: jest.fn(),
    createPost: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostsRepository,
          useValue: mockPostsRepository,
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(postsService).toBeDefined();
  });

  describe('getUsersPosts', () => {
    it('should return an array of posts for a valid userId', async () => {
      const userId = 'validUserId';
      const result: IPosts[] = [
        {
          user_id: userId,
          caption: 'Post 1',
          image_url: 'http://example.com/image1.jpg',
          created_at: new Date(),
          likes: [],
          comments: [],
        },
      ];

      mockPostsRepository.findUsersPosts.mockResolvedValue(result);

      expect(await postsService.getUsersPosts(userId)).toBe(result);
      expect(mockPostsRepository.findUsersPosts).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if the repository throws an error', async () => {
      const userId = 'invalidUserId';
      mockPostsRepository.findUsersPosts.mockRejectedValue(
        new Error('Repository Error'),
      );

      await expect(postsService.getUsersPosts(userId)).rejects.toThrow(
        'Repository Error',
      );
    });
  });

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      const createPostDto: CreatePostsDto = {
        user_id: 'validUserId',
        caption: 'New Post',
        image_url: 'http://example.com/image.jpg',
        created_at: new Date(),
        likes: [],
        comments: [],
      };

      const result: IPosts = {
        ...createPostDto,
      };

      mockPostsRepository.createPost.mockResolvedValue(result);

      expect(await postsService.createPost(createPostDto)).toBe(result);
      expect(mockPostsRepository.createPost).toHaveBeenCalledWith(
        createPostDto,
      );
    });

    it('should throw an error if the repository throws an error', async () => {
      const createPostDto: CreatePostsDto = {
        user_id: 'validUserId',
        caption: 'New Post',
        image_url: 'http://example.com/image.jpg',
        created_at: new Date(),
        likes: [],
        comments: [],
      };

      mockPostsRepository.createPost.mockRejectedValue(
        new Error('Repository Error'),
      );

      await expect(postsService.createPost(createPostDto)).rejects.toThrow(
        'Repository Error',
      );
    });
  });
});
