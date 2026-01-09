import type { Sequelize, Model, ModelStatic } from 'sequelize';
import type { UserAttributes, UserCreationAttributes } from '../../types/user.types.js';
import properties from '../../api/user/user.property.js';

export interface UserModel extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

export interface UserModelStatic extends ModelStatic<UserModel> {
  getUser: (db: any, id: number) => Promise<UserModel | null>;
}

export default (sequelize: Sequelize, DataTypes: typeof import('sequelize').DataTypes): UserModelStatic => {
  const User = sequelize.define<UserModel>('User', Object.assign(properties(DataTypes)), {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_on',
    updatedAt: 'updated_on',
    deletedAt: 'deleted_on',
  }) as UserModelStatic;

  // User.associate = (db) => {};

  User.getUser = (db: any, id: number) =>
    db.User.findOne({
      attributes: ['name', 'email'],
      where: {
        id,
      },
      order: [['id', 'asc']],
      limit: 1,
    });

  return User;
};
