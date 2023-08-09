/*
 * @Description-en:
 * @Description-zh:信息通知模型
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-05 17:06:13
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-27 23:29:27
 */

const db = require("../db/mysql");
const { sequelize, Model, DataTypes } = db;

class notificationModel extends Model {}

// 通知模型初始化
notificationModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "creator",
      comment: "创建人 id",
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "receiver",
      comment: "接受人 id",
    },
    createTime: {
      type: DataTypes.DATE,
      field: "createTime",
      allowNull: false,
      comment: "创建时间",
    },
    notificationCon: {
      type: DataTypes.TEXT,
      field: false,
      allowNull: false,
      comment: "消息内容",
    },
    isDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isDelete",
      comment: "是否删除",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
      comment: "消息状态(已读->1||未读->0)",
    },
  },
  {
    sequelize,
    // 表 不增加复数名，即 user!=>users
    freezeTableName: true,
    // 模型名称
    modelName: "notification",
  },
);

// 自动建表---将表模型定义好后使用一次即可
notificationModel.sync({
  force: false,
});

module.exports = notificationModel;
