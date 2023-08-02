/*
 * @Description-en:
 * @Description-zh:
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-27 22:18:32
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-08-02 11:57:29
 */
const departmentModel = require("../models/department");

const baseController = require("./index");
const { verifyToken } = require("../utils/token");

const { yellow, red, blue } = require("kolorist");

const dayjs = require("dayjs");
const userModel = require("../models/user");

class departmentController extends baseController {
  /**
   * @description 创建小组
   * @description 一个管理员只能管理一个小组
   * @param {*} ctx
   */
  static async createDepartment(ctx) {
    let msg = "";
    let data = [];
    const { departmentName, departmentIntro, departmentAdmin } =
      ctx.request.body;
    try {
      const token = ctx.headers.authorization.split(" ")[1];
      const { authority } = verifyToken(token);

      if (authority === 4) {
        // TODO:该管理员是否管理其他部门，如果有则不允许创建
        const isRepetitive = await userModel.findOne({
          where: { id: departmentAdmin },
        });
        const { departmentId } = isRepetitive;
        if (departmentId !== 0) {
          msg = "创建失败，该用户已经管理其他部门了";
          ctx.response.status = 403;

          console.log(
            yellow("[CREATE DEPARTMENT]:创建失败，该用户已经管理其他部门了"),
          );
        } else {
          // 初始状态下该部门只有管理员
          await departmentModel
            .create({
              departmentName,
              departmentAdmin,
              departmentIntro,
              departmentNum: 1,
              departmentRegister: dayjs(),
              isDelete: false,
              lastUpdate: dayjs(),
            })
            .catch((err) => {
              msg = "创建失败，查询过程中出现意外";
              ctx.response.status = 500;

              console.log(
                red("[CREATE DEPARTMENT]: 创建过程中出现意外！"),
                err,
              );
            });

          // 查询创建信息
          const createInfo = await departmentModel.findOne({
            limit: 1,
            order: [["id", "DESC"]],
            attributes: {
              exclude: ["pwd", "role", "isDelete"],
            },
          });

          data = {
            departmentInfo: createInfo,
          };

          // 获取部门 id
          const { id } = createInfo;

          // 更新管理员的部门 id
          await userModel
            .update({ departmentId: id }, { where: { id: departmentAdmin } })
            .catch((err) => {
              console.log(
                red("[CREATE DEPARTMENT]:更新管理员部门 id 失败"),
                err,
              );
            });

          msg = "success";
          ctx.response.status = 200;

          console.log(blue("[CREATE DEPARTMENT]: 创建成功！"));
        }
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
    ctx.response.body = baseController.renderJsonSuccess(msg, data);
  }

  /**
   * @description 查询所有小组信息以及管理员信息
   * @param {*} ctx
   */
  static async showDepartments(ctx) {
    let msg = "";
    let data = [];
    try {
      const token = ctx.headers.authorization.split(" ")[1];
      const { authority } = verifyToken(token);
      if (authority === 4) {
        const res = await departmentModel
          .findAll({
            attributes: { exclude: ["isDelete"] },
            where: { isDelete: false },
            include: {
              model: userModel,
              attributes: ["id", "userName", "sex", "authority"],
              where: { isDelete: false, authority: 3 },
              required: false,
            },
          })
          .catch((err) => {
            msg = "查询失败，查询过程中出现意外";
            ctx.response.status = 500;

            console.log(red("[SHOW DEPARTMENT]: 查询过程中出现意外！"), err);
          });

        data = {
          departmentList: res,
        };
        msg = "success";
        ctx.response.status = 200;

        console.log(blue("[SHOW DEPARTMENT]: 查询成功！"));
      } else {
        msg = "创建失败，用户权限值不足";
        ctx.response.status = 403;

        console.log(yellow("[SHOW DEPARTMENT]: 用户权限值不够"));
      }
    } catch (err) {
      msg = "token 过期或失效";
      ctx.response.status = 401;

      console.log(yellow("[SHOW DEPARTMENT]: TOKEN 过期或失效"), err);
    }

    ctx.response.body = baseController.renderJsonSuccess(msg, data);
  }

  // TODO：删除组别
  static async delDepartment(ctx) {
    ctx.response.body = baseController.renderJsonSuccess();
  }

  // TODO：查询某部门有哪些人

  /**
   * @param {*} ctx
   * @description 查询特定的小组
   */
  static async findDepartment(ctx) {
    let msg = "";
    let data = [];
    const { id } = ctx.request.body;
    try {
      const token = ctx.headers.authorization.split(" ")[1];
      // TODO:校验权限
      verifyToken(token);

      const info = await departmentModel
        .findByPk(id, { where: { id }, attributes: { exclude: ["isDelete"] } })
        .catch((err) => {
          msg = "查询失败，查询过程中出现意外";
          ctx.response.status = 500;

          console.log(red("[FIND DEPARTMENT]: 查询过程中出现意外！"), err);
        });

      data = {
        info,
      };
      msg = "success";
      ctx.response.status = 200;

      console.log(blue("[FIND DEPARTMENT]: 查询成功！"));
    } catch (err) {
      msg = "token 过期或失效";
      ctx.response.status = 401;

      console.log(yellow("[CREATE DEPARTMENT]: TOKEN 过期或失效"), err);
    }
    ctx.response.body = baseController.renderJsonSuccess(msg, data);
  }
}

module.exports = departmentController;
