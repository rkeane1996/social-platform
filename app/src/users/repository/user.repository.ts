import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from '../schema/users.schema';
import { Model } from 'mongoose';
import { UpdateUserProfileDto } from '../dto/request/update-user-dto';
import { GetUsersResponse } from '../dto/response/get-user-response.interface';

export class UsersRepository {
  constructor(
    @InjectModel(Users.name)
    private readonly usersModel: Model<UsersDocument>,
  ) {}

  async findUser(userId: string): Promise<GetUsersResponse> {
    return await this.usersModel.findOne({ _id: userId }).lean();
  }

  async findUsers(): Promise<GetUsersResponse[]> {
    return await this.usersModel.find().lean();
  }

  async updateUserProfile(updatedUserDetails: UpdateUserProfileDto) {
    return await this.usersModel.findOneAndUpdate(
      { _id: updatedUserDetails.userId },
      {
        $set: {
          bio: updatedUserDetails.bio,
          name: updatedUserDetails.name,
          profile_picture: updatedUserDetails.profile_picture,
        },
      },
    );
  }
}
