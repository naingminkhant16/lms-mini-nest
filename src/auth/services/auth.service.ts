import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { HashingService } from 'src/common/services/password/hashing.service';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';
import { Response } from 'express';
import { TokenBlacklistService } from './token-blacklist.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepo.findOne({
      where: { email: loginDto.email, emailVerified: true },
      relations: ['role'],
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

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15min' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '24h' });
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
    const payload = await this.jwtService.verifyAsync(refreshToken);
    if (!payload) throw new UnauthorizedException('Invalid refresh token');

    // check if token is blacklisted
    const isBlacklisted =
      await this.tokenBlacklistService.isTokenBlacklisted(refreshToken);
    if (isBlacklisted)
      throw new UnauthorizedException('Refresh token is blacklisted');

    const user = await this.userRepo.findOne({
      where: { id: payload.sub },
      relations: ['role'],
    });
    if (!user) throw new NotFoundException('User not found');

    const newPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = this.jwtService.sign(newPayload, {
      expiresIn: '15min',
    });
    const newRefreshToken = this.jwtService.sign(newPayload, {
      expiresIn: '24h',
    });

    // black list the old refresh token
    await this.tokenBlacklistService.blacklistToken(refreshToken, payload.exp);

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

  async logout(refreshToken: string, res: Response): Promise<void> {
    // Clear cookie
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: env.APP_ENV === 'production',
      sameSite: 'strict',
    });

    // retrieve token payload
    const payload = await this.jwtService.verifyAsync(refreshToken);
    if (!payload) throw new UnauthorizedException('Invalid refresh token');

    // Blacklist token
    await this.tokenBlacklistService.blacklistToken(refreshToken, payload.exp);
  }

  async verifyMail(token: string) {
    const payload = await this.jwtService.verifyAsync(token);
    if (!payload) throw new UnauthorizedException('Invalid verification token');

    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user) throw new NotFoundException('User not found');

    user.emailVerified = true;
    await this.userRepo.save(user);
  }
}
