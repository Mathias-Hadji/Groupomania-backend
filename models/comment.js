'use strict';

const moment = require('moment');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Comment.belongsTo(models.User, {
        foreignKey : 'user_id_comment',
        allowNull: false
      });
      models.Comment.belongsTo(models.Publication, {
        foreignKey : 'publication_id_comment',
        allowNull: false
      });
    }
  };
  Comment.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "id"
    },
    user_id_comment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "user_id_comment",
      references: {
        key: "id",
        model: "Users"
      }
    },
    publication_id_comment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "publication_id_comment",
      references: {
        key: "id",
        model: "Publications"
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "comment",
      validate: {
        len: [1, 500]
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
    modelName: 'Comment',
  });
  return Comment;
};