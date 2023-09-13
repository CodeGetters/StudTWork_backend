/*
 * @Description-en:
 * @Description-zh:文章信息模型
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-05 15:13:26
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-08-09 22:11:21
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
      type: DataTypes.TEXT,
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
      // TODO：后台权限校验的时候传的是 1234 需要修改
      // 公开 0 (=== 123) || 隐藏(只对自己可看||草稿) -1 || 选择什么权限才可以看：如 12，则普通用户和管理员可见
      comment: "文章可见范围",
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
    lastUpdate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "lastUpdate",
      comment: "文章最后更新时间",
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

articleModel.sync({
  force: false,
});

module.exports = articleModel;
