/*
 * @Description-en:
 * @Description-zh:
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-29 12:05:35
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-29 12:07:27
 */

const Router = require("@koa/router");
const router = new Router();

const userController = require("../controllers/user");

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

module.exports = router;
