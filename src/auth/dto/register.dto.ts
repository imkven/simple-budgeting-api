import {
  IsString,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsStrongPassword } from '../../validators';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  @MinLength(6)
  @Matches(/^[a-z0-9-_]+$/, { message: 'Username must be alphanumeric' })
  username: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  displayName: string;
}
