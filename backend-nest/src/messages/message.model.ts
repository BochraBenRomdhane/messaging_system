import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table({ tableName: 'messages' })
export class Message extends Model<Message> {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare senderId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare receiverId: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare text: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare image: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare fileName: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare fileType: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare fileData: string | null;

  @BelongsTo(() => User, 'senderId')
  declare sender: User;

  @BelongsTo(() => User, 'receiverId')
  declare receiver: User;
}


