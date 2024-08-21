import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { GetUserQueryDto } from '../dto/request/get-user-dto';
import { UpdateUserProfileDto } from '../dto/request/update-user-dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserResponse } from '../dto/response/update-user-response.interface';
import { UsersRepository } from '../../../lib/repositories/users/user.repository';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  const mockUsersRepository = {
    findUser: jest.fn(),
    findUsers: jest.fn(),
    updateUserProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('should return a user when found', async () => {
      const query: GetUserQueryDto = { userId: '1' };
      const result = {
        _id: 'ds',
        username: 'john',
        name: 'John Doe',
        bio: '',
        profile_picture: '',
        followers: [],
        following: [],
        posts: [],
      };
      jest.spyOn(repository, 'findUser').mockResolvedValue(result as any);

      const res = await service.getUser(query);

      expect(res).toEqual({
        id: 'ds',
        username: 'john',
        name: 'John Doe',
        bio: '',
        profile_picture: '',
        followers: [],
        following: [],
        posts: [],
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      const query: GetUserQueryDto = { userId: '1' };
      jest.spyOn(repository, 'findUser').mockResolvedValue(undefined);

      await expect(service.getUser(query)).rejects.toThrow(
        new NotFoundException('User was not found'),
      );
    });
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const result = [
        {
          _id: 'sds',
          username: 'john',
          name: 'John Doe',
          bio: '',
          profile_picture: '',
          followers: [],
          following: [],
          posts: [],
        },
      ];
      jest.spyOn(repository, 'findUsers').mockResolvedValue(result as any);

      expect(await service.getUsers()).toEqual([
        {
          id: 'sds',
          username: 'john',
          name: 'John Doe',
          bio: '',
          profile_picture: '',
          followers: [],
          following: [],
          posts: [],
        },
      ]);
    });
  });

  describe('updateUserProfile', () => {
    it('should update the user profile and return a response with informationUpdated as true', async () => {
      const updatedUserDetails: UpdateUserProfileDto = {
        userId: '1',
        name: 'John Doe',
        bio: 'New bio',
        profile_picture: 'new_pic.jpg',
      };
      jest.spyOn(repository, 'updateUserProfile').mockResolvedValue(undefined);

      const expectedResponse: UpdateUserResponse = { informationUpdated: true };
      expect(await service.updateUserProfile(updatedUserDetails)).toEqual(
        expectedResponse,
      );
    });

    it('should return a response with informationUpdated as false if an error occurs', async () => {
      const updatedUserDetails: UpdateUserProfileDto = {
        userId: '1',
        name: 'John Doe',
        bio: 'New bio',
        profile_picture: 'new_pic.jpg',
      };
      jest
        .spyOn(repository, 'updateUserProfile')
        .mockRejectedValue(new Error('Failed to update'));

      const expectedResponse: UpdateUserResponse = {
        informationUpdated: false,
      };
      expect(await service.updateUserProfile(updatedUserDetails)).toEqual(
        expectedResponse,
      );
    });
  });
});
