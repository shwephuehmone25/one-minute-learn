import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LogInDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authenticationService.createUser(registerDto);
  }

  @Post('/login')
  async login(@Body() loginDto: LogInDto) {
    return await this.authenticationService.login(loginDto);
  }

  @Post('/refresh-token')
  async refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
    return await this.authenticationService.refreshTokens(refreshToken);
  }
}
