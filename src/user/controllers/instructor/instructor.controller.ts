import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { isUUID } from 'class-validator';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiResponse } from 'src/common/utils/api-response';
import { UserRole } from 'src/role/enums/user-role.enum';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
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

  @Get(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  async getInstructorById(
    @Param('id') id: string,
  ): Promise<ApiResponse<UserResponseDto>> {
    if (!isUUID(id)) throw new BadRequestException('Invalid instructor ID');

    const instructor: User | null = await this.userService.findById(id);

    if (!instructor) throw new NotFoundException('Instructor not found');

    return ApiResponse.success(
      plainToInstance(UserResponseDto, instructor, {
        excludeExtraneousValues: true,
      }),
      'Instructor retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  async updateInstructorById(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    if (!isUUID(id)) throw new BadRequestException('Invalid ID');

    const updatedInstructor: User = await this.userService.update(
      updateUserDto,
      id,
    );

    return ApiResponse.success(
      plainToInstance(UserResponseDto, updatedInstructor, {
        excludeExtraneousValues: true,
      }),
      'Instructor updated successfully',
      HttpStatus.OK,
    );
  }
}
