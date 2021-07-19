'use strict';

const moment = require('moment');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Session.belongsTo(models.User, {
        foreignKey: 'user_id_session',
        allowNull: false,
      })
    }
  };
  Session.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id"
    },
    user_id_session: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id_session",
      references: {
        key: "id",
        model: "Users"
      }
    },
    token_auth: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "token_auth",
      unique: "token_auth"
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "createdAt"
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updatedAt"
    }
  }, {
    sequelize,
    modelName: 'Session',
  });
  return Session;
};