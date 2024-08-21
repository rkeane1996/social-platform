import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PostsRepository } from '../../../lib/repositories/posts/post.repository';
import { UsersRepository } from '../../../lib/repositories/users/user.repository';
import { CreatePostsDto } from '../dto/request/create-posts-response.dto';

describe('PostsService', () => {
  let service: PostsService;
  let postsRepo: PostsRepository;
  let userRepo: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostsRepository,
          useValue: {
            findUsersPosts: jest.fn(),
            createPost: jest.fn(),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            addUserPosts: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postsRepo = module.get<PostsRepository>(PostsRepository);
    userRepo = module.get<UsersRepository>(UsersRepository);
  });

  describe('getUsersPosts', () => {
    it('should return a list of user posts', async () => {
      const mockPosts = [
        {
          _id: 'post1',
          user_id: 'user1',
          caption: 'First post',
          image_url: 'http://example.com/image1.jpg',
          created_at: new Date(),
          likes: [],
          comments: [],
        },
      ];

      jest
        .spyOn(postsRepo, 'findUsersPosts')
        .mockResolvedValue(mockPosts as any);

      const result = await service.getUsersPosts('user1');

      expect(postsRepo.findUsersPosts).toHaveBeenCalledWith('user1');
      expect(result).toEqual([
        {
          id: 'post1',
          user_id: 'user1',
          caption: 'First post',
          image_url: 'http://example.com/image1.jpg',
          created_at: mockPosts[0].created_at,
          likes: [],
          comments: [],
        },
      ]);
    });

    it('should return an empty array if user has no posts', async () => {
      jest.spyOn(postsRepo, 'findUsersPosts').mockResolvedValue([]);

      const result = await service.getUsersPosts('user1');

      expect(postsRepo.findUsersPosts).toHaveBeenCalledWith('user1');
      expect(result).toEqual([]);
    });

    it('should handle error when fetching posts fails', async () => {
      jest
        .spyOn(postsRepo, 'findUsersPosts')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.getUsersPosts('user1')).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('createPost', () => {
    it('should create a post and associate it with a user', async () => {
      const createPostDto: CreatePostsDto = {
        user_id: 'user1',
        caption: 'New Post',
        image_url: 'http://example.com/image.jpg',
        created_at: new Date(),
        likes: [],
        comments: [],
      };

      const mockPost = {
        _id: 'post1',
        user_id: 'user1',
        caption: 'New Post',
        image_url: 'http://example.com/image.jpg',
        created_at: createPostDto.created_at,
        likes: [],
        comments: [],
      };

      jest.spyOn(postsRepo, 'createPost').mockResolvedValue(mockPost as any);
      jest.spyOn(userRepo, 'addUserPosts').mockResolvedValue(undefined);

      const result = await service.createPost(createPostDto);

      expect(postsRepo.createPost).toHaveBeenCalledWith(createPostDto);
      expect(userRepo.addUserPosts).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'post1',
        user_id: 'user1',
        caption: 'New Post',
        image_url: 'http://example.com/image.jpg',
        created_at: createPostDto.created_at,
        likes: [],
        comments: [],
      });
    });

    it('should handle error if post creation fails', async () => {
      const createPostDto: CreatePostsDto = {
        user_id: 'user1',
        caption: 'New Post',
        image_url: 'http://example.com/image.jpg',
        created_at: new Date(),
        likes: [],
        comments: [],
      };

      jest
        .spyOn(postsRepo, 'createPost')
        .mockRejectedValue(new Error('Creation failed'));

      await expect(service.createPost(createPostDto)).rejects.toThrow(
        'Creation failed',
      );
    });

    it('should handle error if associating post with user fails', async () => {
      const createPostDto: CreatePostsDto = {
        user_id: 'user1',
        caption: 'New Post',
        image_url: 'http://example.com/image.jpg',
        created_at: new Date(),
        likes: [],
        comments: [],
      };

      const mockPost = {
        _id: 'post1',
        user_id: 'user1',
        caption: 'New Post',
        image_url: 'http://example.com/image.jpg',
        created_at: createPostDto.created_at,
        likes: [],
        comments: [],
      };

      jest.spyOn(postsRepo, 'createPost').mockResolvedValue(mockPost as any);
      jest
        .spyOn(userRepo, 'addUserPosts')
        .mockRejectedValue(new Error('Association failed'));

      await expect(service.createPost(createPostDto)).rejects.toThrow(
        'Association failed',
      );
    });
  });
});
