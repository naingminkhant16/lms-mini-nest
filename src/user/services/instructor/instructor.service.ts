import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}
}
