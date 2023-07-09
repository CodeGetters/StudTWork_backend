/*
 * @Description-en:
 * @Description-zh:地址信息模型
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-05 14:51:27
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-05 17:15:26
 */
const db = require("../db/mysql");
const userModel = require("./user");
const { sequelize, Model, DataTypes } = db;

class addressModel extends Model {}

// 地址模型初始化
addressModel.init(
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
      comment: "用户名(5-12)或邮箱",
    },
    provincialLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "省级城市名",
    },
    cityLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "市级城市名",
    },
    recordTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "recordTime",
      comment: "记录时间",
    },
  },
  {
    sequelize,
    // 表 不增加复数名，即 user!=>users
    freezeTableName: true,
    // 模型名称
    modelName: "address",
  },
);

// hasMany 方法表示一个用户可以多个登录地址记录
// 而 belongsTo 方法表示一个能记录只能属于一个用户

userModel.hasMany(addressModel);
addressModel.belongsTo(userModel);

// 自动建表---将表模型定义好后使用一次即可
// addressModel.sync({
//   force: true,
// });

module.exports = addressModel;

// // 建立 Users 和 Posts 之间的关联
