import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserProfileDto } from '../../../src/users/dto/request/update-user-dto';
import { Users, UsersDocument } from '../schemas/users.schema';

export class UsersRepository {
  constructor(
    @InjectModel(Users.name)
    private readonly usersModel: Model<UsersDocument>,
  ) {}

  async findUser(userId: string): Promise<UsersDocument> {
    return await this.usersModel.findOne({ _id: userId }).lean();
  }

  async findUsers(): Promise<UsersDocument[]> {
    return await this.usersModel.find().lean();
  }

  async addUserPosts(userId: string, postId: string): Promise<UsersDocument> {
    return await this.usersModel.findOneAndUpdate(
      { _id: userId },
      {
        $push: { posts: {post_id : postId} },
      },
    );
  }

  async addFollwing(userId: string, followingId: string): Promise<UsersDocument> {
    return await this.usersModel.findOneAndUpdate(
      { _id: userId },
      {
        $push: { following: followingId },
      },
    );
  }

  async addFollower(userId: string, followerId: string): Promise<UsersDocument> {
    return await this.usersModel.findOneAndUpdate(
      { _id: userId },
      {
        $push: { followers: followerId },
      },
    );
  }


  async updateUserProfile(updatedUserDetails: UpdateUserProfileDto): Promise<UsersDocument> {
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
