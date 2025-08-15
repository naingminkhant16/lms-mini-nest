import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse } from 'src/common/utils/api-response';
import { UserRole } from 'src/role/enums/user-role.enum';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { InstructorService } from 'src/user/services/instructor/instructor.service';
import { UserService } from 'src/user/services/user.service';

@Controller('instructors')
export class InstructorController {
  constructor(
    private readonly instructorService: InstructorService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerInstructor(@Body() createUserDto: CreateUserDto) {
    const instructor: User = await this.userService.create(
      createUserDto,
      UserRole.INSTRUCTOR,
    );

    return ApiResponse.success(
      instructor,
      'Instructor registered successfully',
      HttpStatus.CREATED,
    );
  }
}
