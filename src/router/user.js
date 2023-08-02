/*
 * @Description-en:
 * @Description-zh:
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-29 12:05:35
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-08-01 23:02:16
 */

const Router = require("@koa/router");
const router = new Router({ prefix: "/user" });

const userController = require("../controllers/user");

router
  // 用户注册
  .post("/register", userController.createUser)
  // 用户登录
  .post("/login", userController.userLogin)
  // 用户修改个人密码
  .post("/update", userController.updatePwd)
  // 用户修改个人信息
  .post("/info", userController.updateUser)
  // 获取权限内的所有用户
  .get("/find", userController.getUser)
  //用户自己手动注销
  .post("/deleteUser", userController.selfLogout)
  // 用户修改个人信息
  .post("/modify", userController.updateUser)
  // 高权限用户删除低权限用户
  .post("/delete", userController.deleteUser)
  // 获取全部管理员信息
  .get("/getManagers", userController.getManagers)
  // 查询特定的用户信息
  .post("/specificUser", userController.specificUser);

module.exports = router;
