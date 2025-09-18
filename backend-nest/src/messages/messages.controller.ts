import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwtGuard';
import { MessagesService } from './messages.service';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('contacts')
  getContacts(@Req() req: Request) {
    return this.messagesService.getAllContacts((req as any).user.id);
  }

  @Get('chats')
  getChatPartners(@Req() req: Request) {
    return this.messagesService.getMyChatPartners((req as any).user.id);
  }

  @Get(':userId')
  getMessages(@Req() req: Request, @Param('userId') userId: string) {
    return this.messagesService.getMessagesByUserId((req as any).user.id, userId);
  }

  @Post('send/:userId')
  sendMessage(@Req() req: Request, @Param('userId') userId: string, @Body() body: any) {
    return this.messagesService.sendMessage((req as any).user.id, userId, body);
  }
}
