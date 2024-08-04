import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Put,
  Query,
} from '@nestjs/common';
import { GetUserQueryDto } from '../dto/request/get-user-dto';
import { UpdateUserProfileDto } from '../dto/request/update-user-dto';
import { UsersService } from '../service/users.service';
import { UpdateUserResponse } from '../dto/response/update-user-response.interface';
import { GetUsersResponse } from '../dto/response/get-user-response.interface';

@Controller('users')
export class UsersController {
  constructor(readonly userService: UsersService) {}

  @Get('user')
  async getUser(
    @Query() query: GetUserQueryDto,
  ): Promise<GetUsersResponse | NotFoundException> {
    return await this.userService.getUser(query);
  }

  @Get('/')
  async getUsers(): Promise<GetUsersResponse[]> {
    return await this.userService.getUsers();
  }

  @Put('update')
  async updateUserProfile(
    @Body() requestBody: UpdateUserProfileDto,
  ): Promise<UpdateUserResponse> {
    return await this.userService.updateUserProfile(requestBody);
  }
}
