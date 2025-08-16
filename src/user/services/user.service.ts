import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/role/enums/user-role.enum';
import { Role } from 'src/role/entities/role.entity';
import { HashingService } from 'src/common/services/password/hashing.service';
import { MailService } from 'src/common/services/mail/mail.service';
import { env } from 'process';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly hashingService: HashingService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
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
      password: await this.hashingService.hashPassword(createUserDto.password),
      address: createUserDto.address,
      phoneNumber: createUserDto.phoneNumber,
      registrationDate: new Date(),
      role: { id: userRole?.id },
    });

    const instructor = await this.userRepo.save(user);

    // Store verify-jwt-token
    const verifyToken = await this.jwtService.signAsync(
      { sub: user.id },
      { expiresIn: '1h' },
    );

    // Send Verified Email
    await this.mailService.sendVerifyMail(
      user.email,
      user.username,
      String(env.MAIL_VERIFY_URL) + '?token=' + verifyToken,
    );

    return instructor;
  }

  findAllByRole(role: UserRole): Promise<User[]> {
    return this.userRepo.find({
      where: { role: { name: role } },
      relations: ['role'],
    });
  }

  findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id },
      relations: ['role'],
    });
  }
}
