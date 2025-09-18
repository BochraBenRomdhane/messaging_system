import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './message.model';
import { User } from '../users/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Message, User])],
  providers: [MessagesService],
  controllers: [MessagesController]
})
export class MessagesModule {}
