/*
 * @Description-en:global router
 * @Description-zh:全局路由
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-06-23 17:58:01
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-04 23:59:44
 */
const Router = require("@koa/router");

const router = new Router();

const userController = require("../controllers/user");

router.get("/router", async (ctx, next) => {
  ctx.type = "json";
  ctx.body = {
    code: 200,
    message: "success!",
  };
  return next();
});

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
/* -------------------------------------------------------- */
// 封装后的路由，用 controller 控制
// router.get("/user", userController.getUser);
// router.get("/detail/:id", userController.getUserDetail);
/* -------------------------------------------------------- */

router.get("/user/:id", async (ctx, next) => {
  const id = ctx.params.id;
  console.log("id:", id);
  if (id === "666") {
    ctx.body = {
      code: 200,
      msg: "输入正确",
      data: [],
    };
  } else {
    ctx.body = {
      code: 200,
      msg: "输入错误",
      data: [],
    };
  }
  return next();
});

router.get("/role", async (ctx, next) => {
  ctx.body = "这是用户角色页";
  return next();
});

router.post("/role", async (ctx, next) => {
  ctx.body = ctx.request.body;
  return next();
});

module.exports = router;
