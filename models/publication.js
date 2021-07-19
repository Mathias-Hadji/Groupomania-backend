'use strict';

const moment = require('moment');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Publication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Publication.belongsTo(models.User, {
        foreignKey : 'user_id_publication',
        allowNull: false,
      });
      models.Publication.hasMany(models.Comment, {
        foreignKey : 'publication_id_comment',
        allowNull: false
      });
      models.Publication.hasMany(models.Like_publication, {
        foreignKey : 'publication_id',
        allowNull: false
      });
    }
  };
  Publication.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id"
    },
    user_id_publication: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id_publication",
      references: {
        model: 'Users', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
    },
    message_publication: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "message_publication",
      validate: {
        len: [1, 500],
      }
    },
    image_publication: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "image_publication",
      validate: {
        len: [1, 500],
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "createdAt",
  
      get() {
        return moment(this.getDataValue('createdAt')).locale('fr').fromNow()
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updatedAt",

      get() {
        return moment(this.getDataValue('updatedAt')).locale('fr').fromNow()
      }
    }
  }, {
    sequelize,
    modelName: 'Publication',
  });
  return Publication;
};