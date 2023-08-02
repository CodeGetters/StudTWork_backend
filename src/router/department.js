/*
 * @Description-en:
 * @Description-zh:
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-29 12:22:51
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-08-02 11:56:30
 */
const Router = require("@koa/router");
const router = new Router({ prefix: "/department" });

const departmentController = require("../controllers/department");

// 创建部门
router
  .post("/create", departmentController.createDepartment)
  .get("/show", departmentController.showDepartments)
  .post("/findOne", departmentController.findDepartment);

module.exports = router;
