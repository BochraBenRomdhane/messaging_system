import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Message } from '../messages/message.model';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ allowNull: false })
  declare fullName: string;

  @Column({ allowNull: false, unique: true })
  declare email: string;

  @Column({ allowNull: false })
  declare passwordHash: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare profilePic: string | null;

  @HasMany(() => Message, 'senderId')
  declare sentMessages: Message[];

  @HasMany(() => Message, 'receiverId')
  declare receivedMessages: Message[];
}


