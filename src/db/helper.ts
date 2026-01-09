import Sequelize, { type Sequelize as SequelizeInstance, DATE } from 'sequelize';

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

export async function properties(model: string): Promise<Record<string, any>> {
  const propertyModule = await import(`../../api/${model}/${model}.property.js`);
  return propertyModule.default(DataTypes);
}

export function keys(model: string) {
  return {
    type: DataTypes.INTEGER,
    references: {
      model,
      key: 'id',
    },
    onUpdate: 'restrict' as const,
    onDelete: 'restrict' as const,
  };
}

export function timestamps(type: string[] = [], sequelize: SequelizeInstance): Record<string, any> {
  const options: Record<string, any> = {};

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
