import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { Person } from '../persons/person.model.js';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model<
  InferAttributes<User, { omit: 'person' }>,
  InferCreationAttributes<User, { omit: 'person' }>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(255))
  declare email: string;

  @AllowNull(false)
  @Unique
  @ForeignKey(() => Person)
  @Column(DataType.UUID)
  declare personUuid: string;

  @BelongsTo(() => Person, 'personUuid')
  declare person: NonAttribute<Person>;
}
