import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @MaxLength(30)
  username: string;

  @IsNotEmpty()
  @MaxLength(100)
  address: string;

  @IsNotEmpty()
  @MaxLength(15)
  phoneNumber: string;
}
