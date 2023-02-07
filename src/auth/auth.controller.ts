import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() user: SignUpDto) {
    return this.authService.signup(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() user: SignInDto) {
    return this.authService.signin(user);
  }
}
