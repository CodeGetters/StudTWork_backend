/*
 * @Description-en:
 * @Description-zh:文章信息模型
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-05 15:13:26
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-14 19:27:07
 */
const { Model, DataTypes } = require("../db/mysql");

const { sequelize } = require("../db/mysql");

const userModel = require("./user.js");

class articleModel extends Model {}

// 文章模型初始化
articleModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    articleName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "articleName",
      comment: "文章名",
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "author",
      comment: "作者||发布用户",
    },
    articleCon: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "articleCon",
      comment: "文章内容",
    },
    releaseTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "releaseTime",
      comment: "发布时间",
    },
    visualRange: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "visualRange",
      // TODO:同权限可看(默认 0)||选择比自己权限等级小的用户(手动选择)
      comment: "文章可见范围",
    },
    isHide: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isHide",
      comment: "是否隐藏(草稿||隐藏)",
    },
    isDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isDelete",
      comment: "是否删除",
    },
    readers: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "readers",
      comment: "文章浏览量(默认 0)",
    },

    // TODO:将点赞量以及评论分离出来
  },
  {
    sequelize,
    freezeTableName: true,
    // 模型名称
    modelName: "article",
  },
);

userModel.hasMany(articleModel);
articleModel.belongsTo(userModel);

// articleModel.sync({
//   force: true,
// });

module.exports = articleModel;
