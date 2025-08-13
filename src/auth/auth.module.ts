import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { HashingService } from 'src/common/services/hashing.service';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { RedisService } from 'src/common/services/redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, HashingService, TokenBlacklistService, RedisService],
})
export class AuthModule {}
