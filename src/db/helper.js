import Sequelize, { DATE } from 'sequelize';

const { DataTypes } = Sequelize;

export const id = {
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true,
  allowNull: false,
  unique: true,
};

export const engine = {
  engine: 'InnoDB',
  charset: 'utf8mb4',
};

export async function properties(model) {
  const propertyModule = await import(`../../api/${model}/${model}.property.js`);
  return propertyModule.default(DataTypes);
}

export function keys(model) {
  return {
    type: DataTypes.INTEGER,
    references: {
      model,
      key: 'id',
    },
    onUpdate: 'restrict',
    onDelete: 'restrict',
  };
}

export function timestamps(type = [], sequelize) {
  const options = {};

  if (type.includes('c')) {
    options.created_on = {
      type: DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    };
  }

  if (type.includes('u')) {
    options.updated_on = {
      type: DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    };
  }

  if (type.includes('d')) {
    options.deleted_on = {
      type: DATE,
      defaultValue: null,
    };
  }

  return options;
}
