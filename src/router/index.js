/*
 * @Description-en:global router
 * @Description-zh:全局路由
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-06-23 17:58:01
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-24 00:14:25
 */
const Router = require("@koa/router");

const router = new Router();

const userController = require("../controllers/user");
const articleController = require("../controllers/article");
const articleModel = require("../models/article");

router.get("/router", async (ctx, next) => {
  ctx.type = "json";
  ctx.body = {
    code: 200,
    message: "success!",
  };
  return next();
});

/* ----------------------user------------------------------ */

router
  // 用户注册
  .post("/user/register", userController.createUser)
  // 用户登录
  .post("/user/login", userController.userLogin)
  // 更改密码
  .post("/user/update", userController.updatePwd)
  .post("/user/info", userController.updateUser)
  // 获取权限内的所有用户
  .get("/user/find", userController.getUser)
  //用户自己手动注销
  .post("/user/deleteUser", userController.selfLogout)
  // 用户修改个人信息
  .post("/user/modify", userController.updateUser)
  // 高权限用户删除低权限用户
  .post("/user/delete", userController.deleteUser);

/* ----------------------article------------------------------ */

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
  // 修改对外公开的文章信息
  .post("/article/updatePublicInfo", articleController.updatePublicInfo)
  // 修改对外公开的文章内容
  .post("/article/updatePublicCon", articleController.updatePublicCon)
  // 删除对外公开的文章
  .post("/article/deletePublic", articleController.deletePublic);

/* -------------------------------------------------------- */

module.exports = router;
