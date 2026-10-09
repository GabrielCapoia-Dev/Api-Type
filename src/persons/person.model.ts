import {
  AllowNull,
  Column,
  DataType,
  Default,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { User } from '../users/user.model.js';

@Table({ tableName: 'persons', timestamps: false })
export class Person extends Model<
  InferAttributes<Person, { omit: 'user' }>,
  InferCreationAttributes<Person, { omit: 'user' }>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare name: string;

  @AllowNull(true)
  @Column(DataType.STRING(11))
  declare cpf: CreationOptional<string | null>;

  @HasOne(() => User, 'personUuid')
  declare user?: NonAttribute<User>;
}
