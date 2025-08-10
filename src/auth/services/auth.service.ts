import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { HashingService } from 'src/common/services/hashing.service';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private hashingService: HashingService,
    private jwtService: JwtService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepo.findOne({
      where: { email: loginDto.email },
    });
    // User not found
    if (!user) throw new NotFoundException(`User ${loginDto.email} not found`);

    const isPasswordValid = await this.hashingService.comparePassword(
      loginDto.password,
      user.password,
    );
    // Password incorrect
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    // generate access token
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '24h' });
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
    const payload = this.jwtService.verify(refreshToken);
    if (!payload) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user) throw new NotFoundException('User not found');

    const newPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = this.jwtService.sign(newPayload, {
      expiresIn: '1h',
    });
    const newRefreshToken = this.jwtService.sign(newPayload, {
      expiresIn: '24h',
    });

    return {
      accessToken: newAccessToken,
      newRefreshToken,
    };
  }

  setRefreshTokenCookie(refreshToken: string, res: Response): void {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: env.APP_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hr
    });
  }
}
