/*
 * @Description-en:model about user
 * @Description-zh:用户相关的模型
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-06-30 11:48:21
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-27 23:28:06
 */

// const { green } = require("kolorist");

const db = require("../db/mysql");
const { sequelize, Model, DataTypes } = db;

class userModel extends Model {}

// 数据类型：https://www.sequelize.cn/core-concepts/model-basics#%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B

// 初始化 User 模型
userModel.init(
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
    sex: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "sex",
      comment: "性别",
    },
    isDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isDelete",
      comment: "是否被删除",
    },
    pwd: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "pwd",
      comment: "密码(5-12)",
    },
    // 超级管理员 -> 4、管理员 -> 3、用户(默认) -> 2、游客 -> 1
    authority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "authority",
      comment: "权限等级，数字越大权限越大",
    },
    // 超级管理员 -> 4、管理员 -> 3、用户(默认) -> 2、游客 -> 1
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "role",
      comment: "角色",
    },
    registerTime: {
      type: DataTypes.DATE,
      field: "registerTime",
      allowNull: false,
      comment: "注册时间",
    },
    //  0(默认) -> 未分配 || 部门编号
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "department",
      comment: "所属组别",
    },
    // TODO：
    // avatar: {
    //   type: DataTypes.TEXT,
    //   field: "avatar",
    //   allowNull: false,
    //   comment: "头像图片 base64 值",
    // },
  },
  {
    // 传递连接实例
    sequelize,
    // 表 不增加复数名，即 user!=>users
    freezeTableName: true,
    // 模型名称
    modelName: "user",
  },
);

// 自动建表---将表模型定义好后使用一次即可
// userModel.sync({
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

module.exports = userModel;
