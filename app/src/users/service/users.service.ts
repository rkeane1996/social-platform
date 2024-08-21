import { Injectable, NotFoundException } from '@nestjs/common';
import { GetUserQueryDto } from '../dto/request/get-user-dto';
import { UpdateUserProfileDto } from '../dto/request/update-user-dto';
import { UpdateUserResponse } from '../dto/response/update-user-response.interface';
import { GetUsersResponse } from '../dto/response/get-user-response.interface';
import { UsersRepository } from '../../../lib/repositories/users/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UsersRepository) {}

  async getUser(
    query: GetUserQueryDto,
  ): Promise<GetUsersResponse | NotFoundException> {
    const userFound = await this.userRepo.findUser(query.userId);

    if (!userFound) {
      throw new NotFoundException('User was not found');
    }

    return this.formatUserResponse(userFound);
  }

  async getUsers(): Promise<GetUsersResponse[]> {
    const users = (await this.userRepo.findUsers()) || [];
    return users.map((posts) => this.formatUserResponse(posts));
  }

  async updateUserProfile(
    updatedUserDetails: UpdateUserProfileDto,
  ): Promise<UpdateUserResponse> {
    const response: UpdateUserResponse = {
      informationUpdated: true,
    };
    try {
      await this.userRepo.updateUserProfile(updatedUserDetails);
    } catch (e) {
      console.log(e);
      response.informationUpdated = false;
    }
    return response;
  }

  private formatUserResponse(user): GetUsersResponse {
    return {
      id: user._id,
      username: user.username,
      name: user.name,
      bio: user.bio,
      profile_picture: user.profile_picture,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
    };
  }
}
