import { IsBoolean } from "class-validator";

export class UpdateRequestDto {
    @IsBoolean()
    isApproved: boolean;
}