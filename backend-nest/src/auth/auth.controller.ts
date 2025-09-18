import { Body, Controller, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwtGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('test')
  test() {
    console.log('🧪 Auth test endpoint called');
    return { message: 'Auth controller is working!' };
  }

  @Get('check')
  @UseGuards(JwtAuthGuard)
  check(@Req() req: Request) {
    console.log('🔍 Auth check called, user:', req.user);
    return req.user;
  }

  @Post('signup')
  async signup(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { user, token } = await this.authService.signup(body);
    res.cookie('token', token, { 
      httpOnly: true, 
      sameSite: 'none', 
      secure: true,
      domain: '.vercel.app'
    });
    return user;
  }

  @Post('login')
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    console.log('🔐 Login attempt:', body);
    try {
      const { user, token } = await this.authService.login(body);
      res.cookie('token', token, { 
        httpOnly: true, 
        sameSite: 'none', 
        secure: true,
        domain: '.vercel.app'
      });
      console.log('✅ Login successful for user:', user.email);
      return user;
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      throw error;
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { message: 'Logged out' };
  }

  @Put('update-profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req: Request, @Body() body: any) {
    return this.authService.updateProfile((req as any).user.id, body);
  }
}
