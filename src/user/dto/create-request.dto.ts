import { IsIn, IsString } from "class-validator";

export class CreateRequestDto {

    @IsString()
    @IsIn(['organizer', 'admin'], { message: 'Invalid promotion role inputted' })
    promoteTo: string;
}