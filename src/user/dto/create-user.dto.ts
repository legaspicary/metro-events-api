import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsIn(['user', 'organizer', 'admin'], { message: 'Invalid role inputted' })
  role: string;

  @IsNotEmpty()
  fullName: string;
}
