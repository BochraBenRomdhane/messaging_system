import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  private signToken(user: User) {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }

  async signup(data: { fullName: string; email: string; password: string }) {
    const existing = await this.userModel.findOne({ where: { email: data.email } });
    if (existing) throw new BadRequestException('Email already in use');
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.userModel.create({ fullName: data.fullName, email: data.email, passwordHash } as any);
    const token = this.signToken(user);
    return { user: this.serialize(user), token };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.userModel.findOne({ where: { email: data.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = this.signToken(user);
    return { user: this.serialize(user), token };
  }

  async updateProfile(userId: string, data: { fullName?: string; profilePic?: string }) {
    await this.userModel.update({ fullName: data.fullName, profilePic: data.profilePic }, { where: { id: userId } });
    const user = await this.userModel.findByPk(userId);
    return this.serialize(user!);
  }

  private serialize(user: User) {
    return { _id: user.id, fullName: user.fullName, email: user.email, profilePic: user.profilePic };
  }
}
