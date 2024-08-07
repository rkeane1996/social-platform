import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostsDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  caption: string;

  @IsString()
  @IsNotEmpty()
  image_url: string;

  @IsDateString()
  @IsNotEmpty()
  created_at: Date;

  @IsArray()
  likes: string[];

  @IsArray()
  comments: string[];
}
