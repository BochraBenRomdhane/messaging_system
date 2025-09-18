import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Message } from './message.model';
import { User } from '../users/user.model';
import { emitToUser } from '../ws/ws.gateway';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message) private readonly messageModel: typeof Message,
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  async getAllContacts(userId: string) {
    return this.userModel.findAll({
      where: { id: { [Op.ne]: userId } },
      attributes: ['id', 'fullName', 'email', 'profilePic'],
    }).then((users) => users.map(this.serializeUser));
  }

  async getMyChatPartners(userId: string) {
    const partnerIds = await this.messageModel.findAll({
      where: { [Op.or]: [{ senderId: userId }, { receiverId: userId }] },
      attributes: ['senderId', 'receiverId'],
      group: ['senderId', 'receiverId'],
    }).then((rows) => {
      const set = new Set<string>();
      rows.forEach((r) => {
        if (r.senderId !== userId) set.add(r.senderId);
        if (r.receiverId !== userId) set.add(r.receiverId);
      });
      return Array.from(set);
    });

    const users = await this.userModel.findAll({ where: { id: partnerIds } });
    return users.map(this.serializeUser);
  }

  async getMessagesByUserId(meId: string, otherUserId: string) {
    const messages = await this.messageModel.findAll({
      where: {
        [Op.or]: [
          { senderId: meId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: meId },
        ],
      },
      order: [['createdAt', 'ASC']],
    });
    return messages.map(this.serializeMessage);
  }

  async sendMessage(meId: string, toUserId: string, body: { text?: string; image?: string; file?: { name: string; type: string; data: string } }) {
    const message = await this.messageModel.create({ 
      senderId: meId, 
      receiverId: toUserId, 
      text: body.text ?? null, 
      image: body.image ?? null,
      fileName: body.file?.name ?? null,
      fileType: body.file?.type ?? null,
      fileData: body.file?.data ?? null
    } as any);
    const serialized = this.serializeMessage(message);
    emitToUser(toUserId, 'newMessage', serialized);
    return serialized;
  }

  private serializeUser = (u: User) => ({ _id: u.id, fullName: u.fullName, email: u.email, profilePic: u.profilePic });
  private serializeMessage = (m: Message) => ({ 
    _id: m.id, 
    senderId: m.senderId, 
    receiverId: m.receiverId, 
    text: m.text, 
    image: m.image,
    file: m.fileName ? {
      name: m.fileName,
      type: m.fileType,
      data: m.fileData
    } : undefined,
    createdAt: m.createdAt 
  });
}
