import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { Op, where, fn, col } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  findById(id: string) {
    return this.userModel.findByPk(id);
  }

  async searchUsers(query: string) {
    const trimmed = (query ?? '').trim();
    if (!trimmed) return [];
    const lowered = trimmed.toLowerCase();
    const users = await this.userModel.findAll({
      where: {
        [Op.or]: [
          where(fn('LOWER', col('fullName')), { [Op.like]: `%${lowered}%` }),
          where(fn('LOWER', col('email')), { [Op.like]: `%${lowered}%` }),
        ],
      },
      attributes: ['id', 'fullName', 'email', 'profilePic'],
      limit: 20,
      order: [['fullName', 'ASC']],
    });
    return users.map((u) => ({ _id: u.id, fullName: u.fullName, email: u.email, profilePic: u.profilePic }));
  }
}
