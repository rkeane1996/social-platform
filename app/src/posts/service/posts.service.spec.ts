import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PostsRepository } from '../../../lib/repositories/posts/post.repository';
import { UsersRepository } from '../../../lib/repositories/users/user.repository';
import { CreatePostsDto } from '../dto/request/create-posts-response.dto';
import { IPosts } from '../dto/response/get-posts-response.interface';

// Mock data
const mockPost: IPosts = {
  user_id: 'user1',
  caption: 'Test Caption',
  image_url: 'http://test.com/image.jpg',
  created_at: new Date(),
  likes: [],
  comments: [],
  id: 'post1',
};

const mockPosts: IPosts[] = [mockPost];

describe('PostsService', () => {
  let postsService: PostsService;
  let postsRepository: PostsRepository;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostsRepository,
          useValue: {
            findUsersPosts: jest.fn().mockResolvedValue(mockPosts),
            createPost: jest.fn().mockResolvedValue(mockPost),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            addUserPosts: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    postsRepository = module.get<PostsRepository>(PostsRepository);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(postsService).toBeDefined();
  });

  describe('getUsersPosts', () => {
    it('should return a list of posts for a user', async () => {
      const userId = 'user1';

      const result = await postsService.getUsersPosts(userId);

      expect(result).toEqual(mockPosts);
      expect(postsRepository.findUsersPosts).toHaveBeenCalledWith(userId);
    });

    it('should return an empty array if no posts are found for a user', async () => {
      jest.spyOn(postsRepository, 'findUsersPosts').mockResolvedValueOnce([]);

      const userId = 'user1';

      const result = await postsService.getUsersPosts(userId);

      expect(result).toEqual([]);
      expect(postsRepository.findUsersPosts).toHaveBeenCalledWith(userId);
    });

    it('should handle a failure in fetching posts for a user', async () => {
      jest
        .spyOn(postsRepository, 'findUsersPosts')
        .mockRejectedValueOnce(new Error('Failed to fetch posts'));

      const userId = 'user1';

      await expect(postsService.getUsersPosts(userId)).rejects.toThrowError(
        'Failed to fetch posts',
      );
    });
  });

  describe('createPost', () => {
    it('should create a post and associate it with a user', async () => {
      const createPostDto: CreatePostsDto = {
        user_id: 'user1',
        caption: 'Test Caption',
        image_url: 'http://test.com/image.jpg',
        created_at: new Date(),
        likes: [],
        comments: [],
      };

      const result = await postsService.createPost(createPostDto);

      expect(result).toEqual(mockPost);
      expect(postsRepository.createPost).toHaveBeenCalledWith(createPostDto);
      expect(usersRepository.addUserPosts).toHaveBeenCalledWith(
        mockPost.user_id,
        mockPost.id,
      );
    });

    it('should handle a failure in creating a post', async () => {
      jest
        .spyOn(postsRepository, 'createPost')
        .mockRejectedValueOnce(new Error('Failed to create post'));

      const createPostDto: CreatePostsDto = {
        user_id: 'user1',
        caption: 'Test Caption',
        image_url: 'http://test.com/image.jpg',
        created_at: new Date(),
        likes: [],
        comments: [],
      };

      await expect(postsService.createPost(createPostDto)).rejects.toThrowError(
        'Failed to create post',
      );
    });

    it('should handle a failure in associating a post with a user', async () => {
      jest
        .spyOn(usersRepository, 'addUserPosts')
        .mockRejectedValueOnce(new Error('Failed to associate post with user'));

      const createPostDto: CreatePostsDto = {
        user_id: 'user1',
        caption: 'Test Caption',
        image_url: 'http://test.com/image.jpg',
        created_at: new Date(),
        likes: [],
        comments: [],
      };

      await expect(postsService.createPost(createPostDto)).rejects.toThrowError(
        'Failed to associate post with user',
      );
    });
  });
});
