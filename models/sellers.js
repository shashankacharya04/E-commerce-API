'use strict';
const {
  Model,
  STRING
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sellers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  sellers.init({
    s_id: DataTypes.STRING,
    s_name: DataTypes.TEXT,
    profile_pic:DataTypes.STRING,
    password: DataTypes.STRING,
    email:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'sellers',
  });
  return sellers;
};