import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { log } from 'console';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiResponse } from 'src/common/utils/api-response';
import { UserRole } from 'src/role/enums/user-role.enum';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
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
  @UseGuards(AuthGuard, AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  async registerInstructor(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    const instructor: User = await this.userService.create(
      createUserDto,
      UserRole.INSTRUCTOR,
    );

    return ApiResponse.success(
      plainToInstance(UserResponseDto, instructor, {
        excludeExtraneousValues: true,
      }),
      'Instructor registered successfully',
      HttpStatus.CREATED,
    );
  }

  @Get('')
  @UseGuards(AuthGuard, AdminGuard)
  async getAllInstructors(): Promise<ApiResponse<UserResponseDto[]>> {
    const instructors: User[] = await this.userService.findAllByRole(
      UserRole.INSTRUCTOR,
    );

    return ApiResponse.success(
      plainToInstance(UserResponseDto, instructors, {
        excludeExtraneousValues: true,
      }),
      'Instructors retrieved successfully',
      HttpStatus.OK,
    );
  }
}
