/*
 * @Description-en:global router
 * @Description-zh:全局路由
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-06-23 17:58:01
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-14 20:05:36
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
  .get("/user/find", userController.getUser);
// 删除用户
// .post("/user/delete", userController);

/* ----------------------article------------------------------ */

router
  .post("/article/upload", articleController.createArticle)
  .get("/article/findArticle", articleController.findArticle);

/* -------------------------------------------------------- */

module.exports = router;
