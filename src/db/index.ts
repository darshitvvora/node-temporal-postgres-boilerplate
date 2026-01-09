import Sequelize from 'sequelize';
import { NODE_ENV, PG_DB } from '../config/environment/index.js';
import logger from '../utils/logger.js';
import UserModel, { type UserModelStatic } from './models/user.model.js';

const sqlDefaults: Sequelize.Options = {
  dialect: 'postgres',
  timezone: '+05:30',
  logging:
    NODE_ENV === 'development' ? (str: string) => logger.debug(str) : false,
  dialectOptions: {
    connectTimeout: 20000,
  },
};

const sequelizeDB = new Sequelize.Sequelize(PG_DB!, sqlDefaults);

interface Database {
  Sequelize: typeof Sequelize;
  sequelizeDB: Sequelize.Sequelize;
  User: UserModelStatic;
  [key: string]: any;
}

const db: Database = {
  Sequelize,
  sequelizeDB,
  User: UserModel(sequelizeDB, Sequelize.DataTypes),
};

// Run associations if they exist
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
