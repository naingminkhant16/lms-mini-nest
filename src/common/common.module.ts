import { Global, Module } from '@nestjs/common';
import { HashingService } from './services/password/hashing.service';
import { IsUniqueConstraint } from './validators/is-unique.constraint';
import { RedisService } from './services/redis/redis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { MailService } from './services/mail/mail.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [HashingService, RedisService, IsUniqueConstraint, MailService],
  exports: [HashingService, RedisService, IsUniqueConstraint, MailService],
})
export class CommonModule {}
