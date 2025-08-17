import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  newPassword: string;

  @IsNotEmpty()
  confirmPassword: string;
}
