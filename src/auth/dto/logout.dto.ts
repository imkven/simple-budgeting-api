import { IsBoolean, IsNotEmpty } from "class-validator";

export class LogoutDto {
  @IsBoolean()
  @IsNotEmpty()
  revokeAll: boolean;
}
