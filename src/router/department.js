/*
 * @Description-en:
 * @Description-zh:
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-29 12:22:51
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-08-01 11:04:09
 */
const Router = require("@koa/router");
const router = new Router({ prefix: "/department" });

const departmentController = require("../controllers/department");

// 创建部门
router
  .post("/create", departmentController.createDepartment)
  .post("/show", departmentController.showDepartments);

module.exports = router;
