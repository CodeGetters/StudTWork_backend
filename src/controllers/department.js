/*
 * @Description-en:
 * @Description-zh:
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-27 22:18:32
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-27 23:33:28
 */
const departmentModel = require("../models/department");

const baseController = require("./index");

class departmentController extends baseController {
  // TODO：创建组别
  static async createDepartment(ctx) {
    ctx.response.body = baseController.renderJsonSuccess();
  }
  // TODO：查询组别
  static async findDepartment(ctx) {
    ctx.response.body = baseController.renderJsonSuccess();
  }

  // TODO：删除组别
  static async delDepartment(ctx) {
    ctx.response.body = baseController.renderJsonSuccess();
  }

  // TODO：查询某部门有哪些人
}

module.exports = departmentController;
