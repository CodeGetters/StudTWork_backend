/*
 * @Description-en:article controller
 * @Description-zh:文章控制器
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-05 16:49:10
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-15 14:14:25
 */
const dayjs = require("dayjs");
const articleModel = require("../models/article");
const { verifyToken } = require("../utils/token");
const baseController = require("./index");
const { Op } = require("sequelize");
const userModel = require("../models/user");
const { yellow, blue } = require("kolorist");

/*
 限制：
 1、token 必须没有过期且有效
 2、被删除的用户不能进行操作
*/

// TODO：每一行的输出显示注明什么文件多少行
class articleController extends baseController {
  /**
   * @description:上传文章
   * @param {*} ctx
   */
  static async createArticle(ctx) {
    // TODO:加入文章标签、分类(数据库是重建一个表还是就在这个表的基础上进行添加？？？)
    let msg = "";
    const { articleCon } = ctx.request.body;

    try {
      const token = ctx.headers.authorization.split(" ")[1];
      const { userName, id, authority } = verifyToken(token);
      // 检查用户权限值
      if (authority === 1) {
        msg = "文章创建失败，用户无权限创建文章";
        ctx.response.status = 403;
        console.log(yellow("[CreateArticle]:文章创建失败，用户权限不足"));
      } else {
        await articleModel.create({
          articleCon,
          articleName: "默认文章名",
          author: userName,
          releaseTime: `${dayjs().format("YYYY-MM-DD HH:mm")}`,
          visualRange: "0",
          isHide: false,
          isDelete: false,
          readers: "0",
          userId: id,
        });

        msg = "上传成功";
        ctx.response.status = 200;
        console.log(blue("[CreateArticle]:文章创建成功"));
      }
    } catch (err) {
      ctx.response.status = 401;
      msg = "token 无效或过期";
      console.log(yellow("[CreateArticle]:Token 无效或过期："), err);
    }

    ctx.body = baseController.renderJsonSuccess(msg);
  }

  /**
   * @description 查看所有权限内公开的所有文章
   * @param {*} ctx
   */
  static async findArticle(ctx) {
    let msg = "";
    let articleList = null;
    let data = {};

    const searchArticle = async (authority) => {
      /* 查询权限值比查询用户的权限值小于等于的所有文章 */
      const res = await articleModel.findAll({
        attributes: [
          "id",
          "author",
          "articleName",
          "releaseTime",
          "readers",
          "articleCon",
        ],
        include: [
          {
            model: userModel,
            // 不用显示用户的这些信息
            // attributes: {
            //   exclude: ["pwd", "sex", "registerTime", "role", "isDelete"],
            // },

            // 不返回用户的信息
            attributes: [],
            where: {
              authority: {
                // 文章所属用户的权限必须小于等于查询用户的权限
                [Op.gte]: authority,
              },
              // 用户不能被删除
              isDelete: {
                // [Op.eq] 运算符表示相等比较 [Op.not] 运算符可以否定一个条件
                [Op.eq]: false,
              },
            },
          },
        ],
      });
      return res;
    };

    try {
      const token = ctx.headers.authorization.split(" ")[1];
      const { authority } = verifyToken(token);

      try {
        articleList = await searchArticle(authority);
        data = {
          articleList,
        };
        msg = "查询成功";
        ctx.response.status = 200;
        console.log(blue("[FindArticle]:文章查询成功"));
      } catch (err) {
        msg = "查询失败";
        ctx.response.status = 500;
        console.log(yellow("[FindArticle]:查询文章失败:"), err);
      }
    } catch (err) {
      ctx.response.status = 401;
      msg = "Token 无效或过期";
      console.log(yellow("[FindArticle]:Token 无效或过期："), err);
    }

    ctx.body = baseController.renderJsonSuccess(msg, data);
  }

  /**
   * @description 查看所有对外公开的文章
   * @param {*} ctx
   */
  static async showArticle(ctx) {
    let msg = "";
    let data = [];

    const searchArticle = (userName) => {
      const res = articleModel.findAll({
        attributes: [],
      });
      return res;
    };

    try {
      const token = ctx.headers.authorization.split(" ")[1];
      const { userName } = verifyToken(token);
    } catch (err) {
      console.log("[SHOW ARTICLE]:token 无效或过期");
    }
    ctx.response.body = baseController.renderJsonSuccess(msg, data);
  }

  /**
   * @description 查看用户自己的所有文章(包括不公开)
   * @param {*} ctx
   */
  static async findPersonal(ctx) {
    ctx.body = baseController.renderJsonSuccess();
  }

  // TODO:修改文章内容
  static async updateArticle(ctx) {
    ctx.body = baseController.renderJsonSuccess();
  }

  // TODO:删除文章
  static async deleteArticle(ctx) {
    ctx.body = baseController.renderJsonSuccess();
  }
}

module.exports = articleController;
