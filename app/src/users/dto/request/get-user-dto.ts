import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserQueryDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
