import { IsNotEmpty, IsString } from 'class-validator';

export class GetPostCommentsQueryDto {
  @IsString()
  @IsNotEmpty()
  postId: string;
}
