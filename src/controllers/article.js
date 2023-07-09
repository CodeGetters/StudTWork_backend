/*
 * @Description-en:article controller
 * @Description-zh:文章控制器
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-05 16:49:10
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-05 17:32:16
 */
const baseController = require("./index");

// const articleModel = require("../models/article");

class articleController extends baseController {
  // TODO：创建文章
  static async createArticle(ctx) {
    ctx.body = baseController.renderJsonSuccess();
  }

  // TODO:查询文章信息
  static async articleInfo(ctx) {
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
