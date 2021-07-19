'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Like_publication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Like_publication.belongsTo(models.User, {
        foreignKey : 'user_id',
        allowNull: false,
        onUpdate: 'cascade', 
        onDelete: 'cascade',
      });
      models.Like_publication.belongsTo(models.Publication, {
        foreignKey : 'publication_id',
        allowNull: false,
        onUpdate: 'cascade', 
        onDelete: 'cascade',
      });
    }
  };
  Like_publication.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id"
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        key: "id",
        model: "Users"
      }
    },
    publication_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "publication_id",
      references: {
        key: "id",
        model: "Publications"
      }
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
    modelName: 'Like_publication',
  });
  return Like_publication;
};