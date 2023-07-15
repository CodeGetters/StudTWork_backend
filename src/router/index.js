/*
 * @Description-en:global router
 * @Description-zh:全局路由
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-06-23 17:58:01
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-15 14:20:32
 */
const Router = require("@koa/router");

const router = new Router();

const userController = require("../controllers/user");
const articleController = require("../controllers/article");

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
  // 注销用户
  .post("/user/delete", userController.deleteUser)
  // 用户修改个人信息
  .post("/user/modify", userController.updateUser);

/* ----------------------article------------------------------ */

router
  // 创建文章
  .post("/article/upload", articleController.createArticle)
  // 查看所有权限内公开的所有文章
  .get("/article/findArticle", articleController.findArticle)
  // 查看所有对外公开的文章
  .get("/article/showArticle", articleController.showArticle)
  // 查看用户自己的所有文章(包括不公开)
  .get("/article/findPersonal", articleController.findPersonal);

/* -------------------------------------------------------- */

module.exports = router;
