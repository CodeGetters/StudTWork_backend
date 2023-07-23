/*
 * @Description-en:model about user
 * @Description-zh:分组
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-06-30 11:48:21
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-23 20:08:32
 */

// const { green } = require("kolorist");

const db = require("../db/mysql");
const { sequelize, Model, DataTypes } = db;

class departmentModel extends Model {}

// 数据类型：https://www.sequelize.cn/core-concepts/model-basics#%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B

// 初始化 User 模型
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
      comment: "部门名",
    },
    departmentNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "departmentNum",
      comment: "部门人数",
    },
    departmentIntro: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "departmentIntro",
      comment: "部门介绍",
    },
    departmentAdmin: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "departmentAdmin",
      comment: "部门管理员 id",
    },
    // TODO
    departmentAvatar: {
      type: DataTypes.TEXT,
      field: "avatar",
      allowNull: true,
      comment: "部门头像",
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

// 自动建表---将表模型定义好后使用一次即可
// departmentModel.sync({
//   force: true,
// });

// sequelize
//   .query("DROP TABLE IF EXISTS user")
//   .then(() => {
//     console.log("user table dropped successfully.");
//   })
//   .catch((err) => {
//     console.error("An error occurred while dropping the article table:", err);
//   });

module.exports = departmentModel;
