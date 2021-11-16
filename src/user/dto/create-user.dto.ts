import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsIn(['user', 'organizer', 'admin'], { message: 'Invalid role inputted' })
  role: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;
}
