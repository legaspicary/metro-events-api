import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateEventDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsDateString()
    @IsNotEmpty()
    startDate: Date;

    @IsDateString()
    @IsNotEmpty()
    endDate: Date;
}
