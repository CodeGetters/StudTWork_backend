/*
 * @Description-en:
 * @Description-zh:
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-29 12:22:51
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-29 12:28:29
 */
const Router = require("@koa/router");
const router = new Router();

const departmentController = require("../controllers/department");

// 创建部门
router.post("/department/create", departmentController.createDepartment);

module.exports = router;
