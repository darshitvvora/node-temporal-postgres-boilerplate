import Sequelize from 'sequelize';
import { NODE_ENV, PG_DB } from '../config/environment/index.js';
import logger from '../utils/logger.js';
import UserModel from './models/user.model.js';

const sqlDefaults = {
  dialect: 'postgres',
  timezone: '+05:30',
  logging:
    NODE_ENV === 'development' ? str => logger.debug(str) : false,
  dialectOptions: {
    connectTimeout: 20000,
  },
};

const sequelizeDB = new Sequelize(PG_DB, sqlDefaults);

const db = {
  Sequelize,
  sequelizeDB,
};

// Initialize models
db.User = UserModel(sequelizeDB, Sequelize.DataTypes);

// Run associations if they exist
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
