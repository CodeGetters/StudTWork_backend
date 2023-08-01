/*
 * @Description-en:
 * @Description-zh:
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-27 22:18:32
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-08-01 10:23:11
 */
const departmentModel = require("../models/department");

const baseController = require("./index");
const { verifyToken } = require("../utils/token");

const { yellow, red, blue } = require("kolorist");

class departmentController extends baseController {
  /**
   * @description 创建小组
   * @param {*} ctx
   */
  static async createDepartment(ctx) {
    let msg = "";

    const { departmentName, departmentIntro, departmentAdmin } =
      ctx.request.body;
    try {
      const token = ctx.headers.authorization.split(" ")[1];
      const { authority } = verifyToken(token);

      if (authority === 4) {
        await departmentModel
          .create({
            departmentName,
            departmentAdmin,
            departmentIntro,
            departmentNum: 1,
          })
          .catch((err) => {
            msg = "创建失败，查询过程中出现意外";
            ctx.response.status = 500;

            console.log(red("[CREATE DEPARTMENT]: 创建过程中出现意外！"), err);
          });

        msg = "success";
        ctx.response.status = 200;

        console.log(blue("[CREATE DEPARTMENT]: 创建成功！"));
      } else {
        msg = "创建失败，用户权限值不足";
        ctx.response.status = 403;

        console.log(yellow("[CREATE DEPARTMENT]: 用户权限值不够"));
      }
    } catch (err) {
      msg = "token 过期或失效";
      ctx.response.status = 401;

      console.log(yellow("[CREATE DEPARTMENT]: TOKEN 过期或失效"), err);
    }
    ctx.response.body = baseController.renderJsonSuccess(msg);
  }
  /**
   * @description 查询小组
   * @param {*} ctx
   */
  static async showDepartments(ctx) {
    let msg = "";
    let data = [];

    ctx.response.body = baseController.renderJsonSuccess(msg, data);
  }

  // TODO：删除组别
  static async delDepartment(ctx) {
    ctx.response.body = baseController.renderJsonSuccess();
  }

  // TODO：查询某部门有哪些人
}

module.exports = departmentController;
