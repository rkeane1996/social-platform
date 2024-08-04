import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../service/users.service';
import { GetUserQueryDto } from '../dto/request/get-user-dto';
import { UpdateUserProfileDto } from '../dto/request/update-user-dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    getUser: jest.fn(),
    getUsers: jest.fn(),
    updateUserProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUser', () => {
    it('should return a user when found', async () => {
      const query: GetUserQueryDto = { userId: '1' };
      const result = {
        username: 'john',
        name: 'John Doe',
        bio: '',
        profile_picture: '',
        followers: [],
        following: [],
        posts: [],
      };
      jest.spyOn(service, 'getUser').mockResolvedValue(result);

      expect(await controller.getUser(query)).toBe(result);
    });

    it('should throw NotFoundException when user not found', async () => {
      const query: GetUserQueryDto = { userId: '1' };
      jest
        .spyOn(service, 'getUser')
        .mockRejectedValue(new NotFoundException('User was not found'));

      await expect(controller.getUser(query)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const result = [
        {
          username: 'john',
          name: 'John Doe',
          bio: '',
          profile_picture: '',
          followers: [],
          following: [],
          posts: [],
        },
      ];
      jest.spyOn(service, 'getUsers').mockResolvedValue(result);

      expect(await controller.getUsers()).toBe(result);
    });
  });

  describe('updateUserProfile', () => {
    it('should update the user profile and return a response', async () => {
      const requestBody: UpdateUserProfileDto = {
        userId: '1',
        name: 'John Doe',
        bio: 'New bio',
        profile_picture: 'new_pic.jpg',
      };
      const result = { informationUpdated: true };
      jest.spyOn(service, 'updateUserProfile').mockResolvedValue(result);

      expect(await controller.updateUserProfile(requestBody)).toBe(result);
    });
  });
});
