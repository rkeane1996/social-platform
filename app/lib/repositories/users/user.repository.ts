import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserProfileDto } from '../../../src/users/dto/request/update-user-dto';
import { GetUsersResponse } from '../../../src/users/dto/response/get-user-response.interface';
import { Users, UsersDocument } from '../schemas/users.schema';

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

  async addUserPosts(userId: string, postId: string){
    return await this.usersModel.findOneAndUpdate(
      { _id: userId },
      {
        $push: { posts: postId },
      },
    );
  }

  async addFollwing(userId: string, followingId: string) {
    return await this.usersModel.findOneAndUpdate(
      { _id: userId },
      {
        $push: { following: followingId },
      },
    );
  }

  async addFollower(userId: string, followerId: string) {
    return await this.usersModel.findOneAndUpdate(
      { _id: userId },
      {
        $push: { followers: followerId },
      },
    );
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
