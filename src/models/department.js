/*
 * @Description-en:model about user
 * @Description-zh:分组
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-06-30 11:48:21
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-27 23:30:15
 */

// https://www.bookstack.cn/read/sequelize-5.x-zh/typescript.md
// https://github.com/demopark/sequelize-docs-Zh-CN/blob/master/other-topics/typescript.md
// https://github.com/demopark/sequelize-docs-Zh-CN

// const { green } = require("kolorist");

const db = require("../db/mysql");
const { sequelize, Model, DataTypes } = db;

const userModel = require("../models/user");

class departmentModel extends Model {}

// 数据类型：https://www.sequelize.cn/core-concepts/model-basics#%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B

// 初始化 departmentModel 模型
departmentModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    departmentName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "departmentName",
      comment: "组名",
    },
    departmentNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "departmentNum",
      comment: "小组人数",
    },
    departmentIntro: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "departmentIntro",
      comment: "小组介绍",
    },
    departmentAdmin: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "departmentAdmin",
      comment: "小组管理员 id",
    },
  },
  {
    // 传递连接实例
    sequelize,
    // 表 不增加复数名，即 user!=>users
    freezeTableName: true,
    // 模型名称
    modelName: "department",
  },
);

departmentModel.hasMany(userModel);
userModel.belongsTo(departmentModel);

// 自动建表---将表模型定义好后使用一次即可
// departmentModel.sync({
//   force: true,
// });

module.exports = departmentModel;
