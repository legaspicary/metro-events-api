import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateParticipantDto {

    @IsIn(['approved', 'declined'], { message: 'Invalid participant status inputted' })
    @IsOptional()
    status: string;

    @IsBoolean()
    @IsOptional()
    hasUpvoted: boolean;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    review: string;
}
