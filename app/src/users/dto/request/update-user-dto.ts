import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserProfileDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  name: string;

  @IsString()
  bio: string;

  @IsString()
  profile_picture: string;
}
