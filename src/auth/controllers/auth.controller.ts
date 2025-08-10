import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { ApiResponse } from 'src/common/utils/api-response';
import { Request, Response } from 'express';

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
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refresh_token = req.cookies['refresh_token'];

    if (!refresh_token) {
      return ApiResponse.error(
        'Refresh token not found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { accessToken, newRefreshToken } =
      await this.authService.refreshToken(refresh_token);

    this.authService.setRefreshTokenCookie(newRefreshToken, res);

    return ApiResponse.success(
      { access_token: accessToken },
      'Refresh Token Successful',
    );
  }
}
