'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Publication, {
        foreignKey: 'user_id_publication',
      });
      models.User.hasMany(models.Comment, {
        foreignKey: 'user_id_comment',
      });
      models.User.hasMany(models.Like_publication, {
        foreignKey: 'user_id',
      });
      models.User.hasOne(models.Session, {
        foreignKey: 'user_id_session',
      });
    }
  };
  User.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    first_name_user: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "first_name_user",
      validate: {
        len: [1, 50],
        is: /^[a-zA-Z éèêëàâîïôöûü-]+$/i
      }
    },
    last_name_user: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "last_name_user",
      validate: {
        len: [1, 50],
        is: /^[a-zA-Z éèêëàâîïôöûü-]+$/i
      }
    },
    email_user: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "email_user",
      unique: "email_user",
      validate: {
        len: [1, 50],
        is: /^[a-zA-Z0-9._-]+[@]{1}[a-zA-Z]+[.]{1}[a-zA-Z]{2,3}$/i
      }
    },
    password_user: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_user",
    },
    profile_pic_user: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "profile_pic_user"
    },
    bio_user: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Aucune description",
      field: "bio_user",
      validate: {
        max: 255,
      }
    },
    is_admin: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: "0",
      field: "is_admin"
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
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};