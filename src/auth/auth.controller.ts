import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { okResponse, TokenPayload } from '../handy';
import { LoginDto, LogoutDto, RefreshTokenDto, RegisterDto } from './dto';
import { AuthGuard } from './auth.guard';
import { Auth } from './ auth.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register.' })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ data: User; }> {
    const data = await this.authService.register(registerDto);
    return okResponse(data);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login.' })
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ data: { accessToken: string; refreshToken: string } }> {
    const data = await this.authService.login(loginDto);
    return okResponse(data); 
  }
  
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout.' })
  async logout(@Body() logoutDto: LogoutDto, @Auth() tokenPayload: TokenPayload): Promise<{ data: { logout: number } }> {
    const data = await this.authService.logout(logoutDto, tokenPayload);
    return okResponse(data);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Getting a new access token.' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<{ data: { accessToken: string; } }> {
    const data = await this.authService.refreshToken(refreshTokenDto);
    return okResponse(data);
  }
}
