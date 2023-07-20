/*
 * @Description-en:
 * @Description-zh:
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-20 22:56:10
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-20 23:37:27
 */
const db = require("../db/mysql");
const userModel = require("./user");
const { sequelize, Model, DataTypes } = db;

class locationModel extends Model {}
// TODO:还要显示用户 id、不然无法判断这个用户是否已经注销了
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

// 自动建表---将表模型定义好后使用一次即可
// locationModel.sync({
//   force: true,
// });
userModel.hasMany(locationModel);
locationModel.belongsTo(userModel);

module.exports = locationModel;
