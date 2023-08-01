/*
 * @Description-en:
 * @Description-zh:
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-29 12:06:20
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-08-01 11:05:01
 */
const Router = require("@koa/router");
const router = new Router({ prefix: "/article" });

const articleController = require("../controllers/article");

router
  // 创建文章
  .post("/upload", articleController.createArticle)
  // 查看所有权限内公开的所有文章
  .get("/findArticle", articleController.findArticle)
  // 查看所有对外公开的文章
  .get("/showArticle", articleController.showArticle)
  // 查看用户自己的所有文章(包括不公开)
  .get("/findPersonal", articleController.findPersonal)
  // 修改自己的文章信息
  .post("/updatePersonal", articleController.updatePersonal)
  // 修改自己的文章信息
  .post("/updateCon", articleController.updateCon)
  // 删除用户自己的文章
  .post("/deletePersonal", articleController.deletePersonal)
  // TODO：修改文章的信息需要修改理由
  // 修改对外公开的文章信息
  .post("/updatePublicInfo", articleController.updatePublicInfo)
  // 修改对外公开的文章内容
  .post("/updatePublicCon", articleController.updatePublicCon)
  // 删除对外公开的文章
  .post("/deletePublic", articleController.deletePublic);

module.exports = router;
