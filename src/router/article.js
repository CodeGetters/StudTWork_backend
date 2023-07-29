/*
 * @Description-en:
 * @Description-zh:
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-29 12:06:20
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-29 12:06:28
 */
const Router = require("@koa/router");
const router = new Router();

const articleController = require("../controllers/article");

router
  // 创建文章
  .post("/article/upload", articleController.createArticle)
  // 查看所有权限内公开的所有文章
  .get("/article/findArticle", articleController.findArticle)
  // 查看所有对外公开的文章
  .get("/article/showArticle", articleController.showArticle)
  // 查看用户自己的所有文章(包括不公开)
  .get("/article/findPersonal", articleController.findPersonal)
  // 修改自己的文章信息
  .post("/article/updatePersonal", articleController.updatePersonal)
  // 修改自己的文章信息
  .post("/article/updateCon", articleController.updateCon)
  // 删除用户自己的文章
  .post("/article/deletePersonal", articleController.deletePersonal)
  // TODO：修改文章的信息需要修改理由
  // 修改对外公开的文章信息
  .post("/article/updatePublicInfo", articleController.updatePublicInfo)
  // 修改对外公开的文章内容
  .post("/article/updatePublicCon", articleController.updatePublicCon)
  // 删除对外公开的文章
  .post("/article/deletePublic", articleController.deletePublic);

module.exports = router;
