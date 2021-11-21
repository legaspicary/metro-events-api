import { IsIn, IsOptional } from "class-validator";

export class QueryParticipantDto {
    @IsIn(['pending', 'approved', 'declined'], { message: 'Invalid participant status inputted' })
    @IsOptional()
    status: string;
}
