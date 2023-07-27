/*
 * @Description-en:
 * @Description-zh:
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-20 22:56:10
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-27 23:07:04
 */
const db = require("../db/mysql");
const userModel = require("./user");
const { sequelize, Model, DataTypes } = db;

class locationModel extends Model {}
locationModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "userName",
      comment: "登录用户名",
    },
    loginTime: {
      type: DataTypes.DATE,
      field: "loginTime",
      allowNull: false,
      comment: "登录时间",
    },
    province: {
      type: DataTypes.STRING,
      field: "province",
      allowNull: false,
      comment: "登录省份",
    },
    city: {
      type: DataTypes.STRING,
      field: "city",
      allowNull: false,
      comment: "登录城市(市级)",
    },
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: "location",
  },
);

userModel.hasMany(locationModel);
locationModel.belongsTo(userModel);

// 自动建表---将表模型定义好后使用一次即可
// locationModel.sync({
//   force: true,
// });

module.exports = locationModel;
