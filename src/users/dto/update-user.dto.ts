import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(24)
    displayName: string;
}
