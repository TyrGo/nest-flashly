import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserIsUserGuard } from './gaurds/user-is-user.gaurd';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<{ accessToken: string }> {
    const token = await this.authService.registerUser(username, password);
    return token;
  }

  @Post('login')
  async loginUser(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<{ accessToken: string }> {
    const token = await this.authService.loginUser(username, password);
    return token;
  }

  @UseGuards(AuthGuard('jwt'), UserIsUserGuard)
  @Get('me')
  getProfile() {
    return 'Hello';
  }
}
