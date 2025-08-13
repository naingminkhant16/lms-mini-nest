import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { ApiResponse } from 'src/common/utils/api-response';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);

    this.authService.setRefreshTokenCookie(refreshToken, res);

    return ApiResponse.success(
      { access_token: accessToken },
      'Login Successful',
    );
  }

  @Post('/refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refresh_token = req.cookies['refresh_token'];

    if (!refresh_token) {
      throw new BadRequestException('Refresh token not found');
    }

    const { accessToken, newRefreshToken } =
      await this.authService.refreshToken(refresh_token);

    this.authService.setRefreshTokenCookie(newRefreshToken, res);

    return ApiResponse.success(
      { access_token: accessToken },
      'Refresh Token Successful',
    );
  }

  // Test Auth Middleware / access authorized resource
  @UseGuards(AuthGuard, AdminGuard)
  @Get('/test-auth')
  testAuth(@Req() req: Request) {
    return ApiResponse.success({ user: req['auth'] }, 'Authorized');
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refresh_token = req.cookies['refresh_token'];

    if (!refresh_token)
      throw new BadRequestException('Refresh token not found');

    await this.authService.logout(refresh_token, res);

    return ApiResponse.success(null, 'Logout Successful');
  }
}
