/*
 * @Description-en:article controller
 * @Description-zh:文章控制器
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-05 16:49:10
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-14 20:52:06
 */
const dayjs = require("dayjs");
const articleModel = require("../models/article");
const { verifyToken } = require("../utils/token");
const baseController = require("./index");
const { Op } = require("sequelize");
const userModel = require("../models/user");

class articleController extends baseController {
  /**
   * @description:上传文章
   * @param {*} ctx
   */
  static async createArticle(ctx) {
    // TODO：待优化，逻辑以及返回状态码，返回信息
    let msg = "";
    let validToken = null;

    const { articleCon } = ctx.request.body;

    try {
      const token = ctx.headers.authorization.split(" ")[1];
      validToken = verifyToken(token);
    } catch (err) {
      console.log("this is a error:", err);
    }

    const { userName, id } = validToken;

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

    ctx.body = baseController.renderJsonSuccess(msg);
  }

  /**
   * @description 查看所有权限内公开的文章名
   * @param {*} ctx
   */
  static async findArticle(ctx) {
    // TODO：待优化，逻辑以及返回状态码，返回信息
    let msg = "";
    let validToken = null;
    let articleList = null;
    let data = {};

    try {
      const token = ctx.headers.authorization.split(" ")[1];
      validToken = verifyToken(token);
    } catch (err) {
      console.log("this is a error:", err);
    }

    const { authority } = validToken;

    try {
      const searchArticle = async (authority) => {
        /**
         * @description 查询权限值比查询用户的权限值小于等于的文章
         */
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
              where: {
                authority: {
                  // 文章所属用户的权限必须小于等于查询用户的权限
                  [Op.gte]: authority,
                },
              },
            },
          ],
        });
        return res;
      };
      articleList = await searchArticle(authority);
    } catch (err) {
      console.log(err);
    }
    msg = "查询成功";
    data = {
      articleList,
    };
    ctx.body = baseController.renderJsonSuccess(msg, data);
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
