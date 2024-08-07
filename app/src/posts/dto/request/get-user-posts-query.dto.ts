import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserPostQueryDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
