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
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "id"
    },
    user_id_publication: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "user_id_publication",
      references: {
        model: 'Users', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
    },
    message_publication: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "message_publication",
      validate: {
        len: [1, 500],
      }
    },
    image_publication: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "image_publication",
      validate: {
        len: [1, 500],
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "createdAt",
  
      get() {
        return moment(this.getDataValue('createdAt')).locale('fr').fromNow()
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
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