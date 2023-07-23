/*
 * @Description-en:
 * @Description-zh:
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-23 19:59:33
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-23 20:02:31
 */
const db = require("../db/mysql");
const { sequelize, Model, DataTypes } = db;

class positionModel extends Model {}

// 数据类型：https://www.sequelize.cn/core-concepts/model-basics#%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B

// 初始化 User 模型
positionModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    positionName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "positionName",
      comment: "职位",
    },
  },
  {
    // 传递连接实例
    sequelize,
    // 表 不增加复数名，即 user!=>users
    freezeTableName: true,
    // 模型名称
    modelName: "position",
  },
);

// 自动建表---将表模型定义好后使用一次即可
// positionModelModel.sync({
//   force: true,
// });

module.exports = positionModelModel;
