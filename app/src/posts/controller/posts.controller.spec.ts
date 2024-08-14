import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from '../service/posts.service';
import { GetUserPostQueryDto } from '../dto/request/get-user-posts-query.dto';
import { IPosts } from '../dto/response/get-posts-response.interface';
import { CreatePostsDto } from '../dto/request/create-posts-response.dto';

describe('PostsController', () => {
  let postsController: PostsController;

  const mockPostsService = {
    getUsersPosts: jest.fn(),
    createPost: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
      ],
    }).compile();

    postsController = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(postsController).toBeDefined();
  });

  describe('getUsersPost', () => {
    it('should return an array of posts for a valid userId', async () => {
      const userId = 'validUserId';
      const result: IPosts[] = [
        {
          id: 'id test',
          user_id: userId,
          caption: 'Post 1',
          image_url: 'http://example.com/image1.jpg',
          created_at: new Date(),
          likes: [],
          comments: [],
        },
      ];

      mockPostsService.getUsersPosts.mockResolvedValue(result);

      const query: GetUserPostQueryDto = { userId };
      expect(await postsController.getUsersPost(query)).toBe(result);
    });
  });

  describe('makePost', () => {
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
        id: 'id test',
        ...createPostDto,
      };

      mockPostsService.createPost.mockResolvedValue(result);

      expect(await postsController.makePost(createPostDto)).toBe(result);
    });
  });
});
