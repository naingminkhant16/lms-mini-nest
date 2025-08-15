import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/role/enums/user-role.enum';
import { Role } from 'src/role/entities/role.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    private mailService: MailerService,
  ) {}

  async create(createUserDto: CreateUserDto, role: UserRole): Promise<User> {
    // Check password confirmation
    if (createUserDto.password !== createUserDto.confirmPassword)
      throw new BadRequestException('Password confirmation does not match');

    // Retrieve Role
    const userRole: Role | null = await this.roleRepo.findOne({
      where: { name: role },
    });
    if (!userRole) throw new BadRequestException('Invalid user role');

    // Store in DB
    const user = this.userRepo.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: createUserDto.password,
      address: createUserDto.address,
      phoneNumber: createUserDto.phoneNumber,
      registrationDate: new Date(),
      role: { id: userRole?.id },
    });

    const instructor = await this.userRepo.save(user);
    // Send Verified Email
    this.mailService.sendMail({
      to: user.email,
      subject: 'Welcome to LMS',
      text: 'Welcome Message',
    });

    return instructor;
  }
}
