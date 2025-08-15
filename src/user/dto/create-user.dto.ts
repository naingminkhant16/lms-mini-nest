import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { IsUnique } from 'src/common/decorators/is-unique.decorator';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(30)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  @IsUnique(User, { message: 'Email already exists!' })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  @IsNotEmpty()
  @MaxLength(100)
  address: string;

  @IsNotEmpty()
  @MaxLength(15)
  phoneNumber: string;
}
