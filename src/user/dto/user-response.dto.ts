import { Expose, Type } from 'class-transformer';
import { RoleResponseDto } from 'src/role/dto/role-response.dto';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  username: string;
  @Expose()
  email: string;

  @Expose()
  address: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  registrationDate: Date;

  @Expose()
  @Type(() => RoleResponseDto)
  role: RoleResponseDto;
}
