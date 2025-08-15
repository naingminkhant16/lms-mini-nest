import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { InstructorController } from './controllers/instructor/instructor.controller';
import { InstructorService } from './services/instructor/instructor.service';
import { Role } from 'src/role/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UserController, InstructorController],
  providers: [UserService, InstructorService],
})
export class UserModule {}
