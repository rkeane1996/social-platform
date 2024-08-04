import { Injectable, NotFoundException } from '@nestjs/common';
import { GetUserQueryDto } from '../dto/request/get-user-dto';
import { UpdateUserProfileDto } from '../dto/request/update-user-dto';
import { UsersRepository } from '../repository/user.repository';
import { UpdateUserResponse } from '../dto/response/update-user-response.interface';
import { GetUsersResponse } from '../dto/response/get-user-response.interface';

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

    return userFound;
  }

  async getUsers(): Promise<GetUsersResponse[]> {
    return await this.userRepo.findUsers();
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
}
