import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddLikeDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsOptional()
  post_id?: string;

  @IsString()
  @IsOptional()
  comment_id?: string;
}
