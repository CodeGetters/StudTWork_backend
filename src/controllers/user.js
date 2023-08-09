/*
 * @Description-en:user controller
 * @Description-zh:用户中间层
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-06-29 23:29:57
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-08-05 11:08:13
 */
const baseController = require("./index");

const userModel = require("../models/user");

const { createToken, verifyToken } = require("../utils/token");

const { yellow, blue, green, red } = require("kolorist");

const { Op } = require("sequelize");

const dayjs = require("dayjs");

const { createLocation } = require("../utils/location");
const departmentModel = require("../models/department");
const notificationModel = require("../models/notification");
/*
 限制：
 1、token 必须没有过期且有效
 2、被删除的用户不能进行操作
*/

class userController extends baseController {
  /**
   * @description 用户注册
   * @param {*} ctx
   */
  static async createUser(ctx) {
    let msg = "";
    let data = [];
    let userInfo = null;

    const { userName, pwd, gender, city, province } = ctx.request.body;

    const isExist = await userModel.findOne({
      attributes: ["isDelete"],
      where: {
        userName,
        isDelete: false,
      },
    });
    /* 用户名不存在或者该用户的 isDelete 值为 true */
    if (isExist) {
      msg = "用户名已存在，注册失败";
      ctx.response.status = 409;

      console.log(yellow("[CREATE USER]:用户名已存在，注册失败"));
    } else {
      try {
        await userModel.create({
          userName,
          pwd,
          registerTime: dayjs(),
          // 超级管理员-4、管理员-3、普通用户-2、游客-1
          authority: 2,
          role: "普通用户",
          sex: gender === "" ? "保密" : gender,
          isDelete: false,
          //  0(默认) -> 未分配 || 部门编号
          departmentId: 0,
        });

        // 获取用户注册的相关信息---查询最后一个用户信息
        const lastUser = await userModel.findOne({
          // 降序排序
          order: [["id", "DESC"]],
          // `exclude` 属性指定要排除的列
          attributes: {
            exclude: ["pwd", "role", "isDelete"],
          },
        });
        const { id, authority, role, sex, departmentId } = lastUser;
        // 记录位置信息
        await createLocation(id, userName, city, province, dayjs());

        // token 需要携带的用户信息
        userInfo = { id, userName, authority, role, sex, departmentId };
        data = {
          token: await createToken(userInfo),
          userInfo,
        };

        msg = "success";
        ctx.response.status = 200;

        console.log(blue("用户注册成功！"));
      } catch (err) {
        msg = "用户创建时失败，请重试！";
        ctx.response.status = 500;
        console.log(yellow("用户创建时失败，请重试！"), err);
      }
    }
    ctx.body = baseController.renderJsonSuccess(msg, data);
  }

  /**
   * @description 用户登录
   * @param {*} ctx
   */

  static async userLogin(ctx) {
    let msg = "";
    let userInfo = null;
    let data = "";

    const { userName, pwd, city, province } = ctx.request.body;

    try {
      // 根据用户名查询用户的 id、账号、密码、权限等级、是否注销 字段
      const userExist = await userModel
        .findOne({
          attributes: {
            exclude: ["role", "isDelete"],
          },
          where: {
            userName,
            isDelete: false,
          },
        })
        .catch((err) => {
          msg = "登录失败，查询过程中出现意外";
          ctx.response.status = 500;

          console.log(red("[USER LOGIN]:登录失败"), err);
        });

      if (!userExist) {
        msg = "登录失败，用户名不存在";
        ctx.response.status = 404;

        console.log(yellow("[USER LOGIN]:用户名不存在，用户登录失败"));
      } else if (pwd !== userExist.dataValues.pwd) {
        msg = "登录失败，密码错误";
        ctx.response.status = 403;

        console.log(yellow("[USER LOGIN]:登录失败，密码错误"));
      } else {
        const userRegister = userExist.dataValues.registerTime;

        const { id, sex, authority, departmentId } = userExist;

        // token 携带的用户信息
        userInfo = { id, userName, authority, sex, userRegister, departmentId };
        // 记录登录位置信息
        await createLocation(id, userName, city, province, dayjs());

        data = {
          token: createToken(userInfo),
          userInfo,
        };
        msg = "success";
        ctx.response.status = 200;

        console.log(blue("[USER LOGIN]:登录成功"));
      }
    } catch (err) {
      msg = "登录失败";
      ctx.response.status = 500;

      console.log(yellow("[USER LOGIN]:登录失败"), err);
    }

    ctx.body = baseController.renderJsonSuccess(msg, data);
  }

  /**
   * @description 查找权限内的所有用户(没有被删除) 比如 用户 A 权限等级为 3，他能查询比它权限等级小的所有用户 2 1
   * @param {*} ctx
   */
  static async getUser(ctx) {
    let msg = "";
    let data = "";

    /* 根据用户的权限值获取权限下的所有用户 */
    const searchUser = async (userAuthority) => {
      const res = await userModel.findAll({
        attributes: {
          exclude: ["pwd", "isDelete"],
        },
        where: {
          isDelete: false,
          authority: {
            // Op.lte 来表示小于等于运算符 gt:> gte:>= lt:<
            [Op.lt]: userAuthority,
          },
        },
      });
      return res;
    };

    try {
      // 从请求头中获取 token
      const token = ctx.headers.authorization.split(" ")[1];

      const userAuthority = verifyToken(token).authority;

      // 根据权限值不同做不用的事情 游客-用户-管理员-超级管理员
      if (userAuthority === 1) {
        msg = "用户权限等级不够，查询失败";
        ctx.response.status = 403;

        console.log(yellow("[FIND ALLUSER]:查询失败，用户权限等级不够"));
      } else {
        data = {
          users: await searchUser(userAuthority),
        };

        msg = "查询成功";
        ctx.response.status = 200;

        console.log(blue("[FIND ALLUSER]:查询成功"));
      }
    } catch (err) {
      ctx.response.status = 401;
      msg = "Token 无效或已过期";

      console.log(yellow("[FIND ALLUSER]:Token 已过期或 Token 值不规范"));
    }

    ctx.body = baseController.renderJsonSuccess(msg, data);
  }

  // TODO：修改成功后需要用户重新登录

  /**
   * @description 用户修改个人密码
   * @param {*} ctx
   */
  static async updatePwd(ctx) {
    let msg = "";
    const { newPwd, oldPwd } = ctx.request.body;

    try {
      // 从请求头中获取 token
      const token = ctx.headers.authorization.split(" ")[1];
      const { id } = verifyToken(token);

      try {
        // 根据用户 id 进行查该用户的相关信息
        const userInfo = await userModel.findOne({
          attributes: ["pwd"],
          where: {
            id,
            isDelete: false,
          },
        });

        if (userInfo.dataValues.pwd !== oldPwd) {
          msg = "原密码错误，修改失败";
          ctx.response.status = 403;
          console.log(yellow("[UPDATE PWD]:原密码错误，修改失败"));
        } else {
          // 更新密码
          await userModel.update({ pwd: newPwd }, { where: { id } });
          msg = "修改成功，请使用新密码重新登录";
          ctx.response.status = 200;
          console.log(blue("[UPDATE PWD]:修改密码成功"));
        }
      } catch (err) {
        msg = "修改时发生错误，请重试";
        ctx.response.status = 500;
        console.log(red("[UPDATE PWD]:修改密码时发生错误"), err);
      }
    } catch (err) {
      msg = "token 过期或无效";
      ctx.response.status = 401;
      console.log(yellow("[UPDATE PWD]:TOKEN 过期或无效"), err);
    }

    ctx.body = baseController.renderJsonSuccess(msg);
  }

  // TODO：修改成功后需要用户重新登录

  /**
   * @description 用户修改个人信息
   * @param {*} ctx
   */
  static async updateUser(ctx) {
    let msg = "";
    const { userName, sex } = ctx.request.body;
    try {
      const token = ctx.headers.authorization.split(" ")[1];
      const { id } = verifyToken(token);

      try {
        // 用新信息覆盖旧的信息
        userModel.update({ userName, sex }, { where: { id } });
        msg = "修改成功";
        ctx.response.status = 200;

        console.log(blue("[UPDATE USER]:修改成功"));
      } catch (err) {
        msg = "修改失败，修改时发生错误";
        ctx.response.status = 500;
        console.log(red("[UPDATE USER]:修改失败，修改时发生错误"), err);
      }
    } catch (err) {
      msg = "token 过期或无效";
      ctx.response.status = 401;
      console.log(yellow("[UPDATE USER]:Token 已过期"));
    }
    ctx.response.body = baseController.renderJsonSuccess(msg);
  }

  /**
   * @description 修改比用户权限低的用户信息
   * // TODO:站内信内容还需要重新写一下
   * @param {*} ctx
   */
  static async adminUpdate(ctx) {
    let msg = "";
    const { id, userName, authority, sex, departmentId, reason } =
      ctx.request.body;
    try {
      const token = ctx.headers.authorization.split(" ")[1];
      const userId = verifyToken(token).id;
      if (!reason) {
        // 超级管理员操作，直接修改
        await userModel
          .update(
            {
              userName,
              authority,
              sex,
              departmentId,
            },
            { where: { id } },
          )
          .catch((err) => {
            msg = "修改失败，修改时发生错误";
            ctx.response.status = 500;

            console.log(red("[ADMIN UPDATE]:执行过程中出现意外"), err);
          });
        msg = "success";
        ctx.response.status = 200;
        console.log(blue("[ADMIN UPDATE]:修改成功"));
      } else {
        // 超级管理员 id
        const findSuperAdmin = await userModel
          .findOne({ attributes: ["id"] }, { where: { authority: 4 } })
          .catch((err) => {
            console.log(red("[ADMIN UPDATE]:查找时发生错误:", err));
          });
        const superAdminID = findSuperAdmin.dataValues.id;
        // 生成站内信
        await notificationModel
          .create({
            creatorId: userId,
            receiverId: superAdminID,
            createTime: dayjs(),
            notificationCon: reason,
            isDelete: false,
            status: 0,
          })
          .catch((err) => {
            msg = "站内信发送时出现意外";

            ctx.response.status = 500;
            console.log(red("[ADMIN UPDATE]:站内信发送时出现意外"), err);
          });
        msg = "success";
        ctx.response.status = 200;

        console.log(blue("[ADMIN UPDATE]:站内信发送成功"));
      }
    } catch (err) {
      msg = "token 过期或无效";
      ctx.response.status = 401;

      console.log(yellow("[ADMIN UPDATE]:Token 已过期"));
    }
    ctx.response.body = baseController.renderJsonSuccess(msg);
  }

  /**
   * @description 用户自己手动注销
   * @param {*} ctx
   */
  static async selfLogout(ctx) {
    let msg = "";

    try {
      const token = ctx.headers.authorization.split(" ")[1];
      const { id } = verifyToken(token);

      try {
        await userModel.update(
          {
            isDelete: true,
          },
          {
            where: {
              id,
            },
          },
        );
        msg = "注销成功";
        ctx.response.status = 200;

        console.log(blue("[DELETE USER]:注销成功"));
      } catch (err) {
        msg = "注销失败，注销时发生错误";
        ctx.response.status = 500;
        console.log(red("[DELETE USER]:注销时发生错误"), err);
      }
    } catch (err) {
      msg = "token 过期或失效";
      ctx.response.status = 401;
      console.log(yellow("[DELETE USER]: TOKEN 过期或失效"), err);
    }
    ctx.response.body = baseController.renderJsonSuccess(msg);
  }

  /**
   * @description 高权限用户删除低权限用户
   * @param {*} ctx
   */
  static async deleteUser(ctx) {
    let msg = "";
    const { id, reason } = ctx.request.body;
    try {
      const token = ctx.headers.authorization.split(" ")[1];
      const userId = verifyToken(token).id;
      if (!reason) {
        await userModel
          .update({ isDelete: true }, { where: { id } })
          .catch((err) => {
            msg = "删除失败，删除时发生意外";
            ctx.response.status = 500;

            console.log(red("[DELETE USER]:删除失败，删除时发生意外"), err);
          });
        msg = "success";
        ctx.response.status = 200;

        console.log(blue("[DELETE USER]:修改成功"));
      } else {
        // 管理员 id
        const superAdmin = await userModel
          .findOne({ attributes: ["id"] }, { where: { authority: 4 } })
          .catch((err) => {
            msg = "查询失败，查询过程中发生意外";
            ctx.response.status = 500;

            console.log(red("[DELETE USER]:查询失败，查询过程中发生意外"), err);
          });
        const superAdminID = superAdmin.dataValues.id;

        // 创建站内信
        await notificationModel
          .create({
            creatorId: userId,
            receiverId: superAdminID,
            createTime: dayjs(),
            notificationCon: reason,
            isDelete: false,
            status: 0,
          })
          .catch((err) => {
            msg = "申请失败，站内信创建过程中发生意外";
            ctx.response.status = 500;

            console.log(
              red("[DELETE USER]:申请失败，站内信创建过程中发生意外"),
              err,
            );
          });
        msg = "success";
        ctx.response.status = 200;

        console.log(blue("[DELETE USER]:站内信发送成功"));
      }
    } catch (err) {
      msg = "token 过期或失效";
      ctx.response.status = 401;
      console.log(yellow("[DELETE USER]: TOKEN 过期或失效"), err);
    }

    ctx.response.body = baseController.renderJsonSuccess(msg);
  }

  /**
   * @description 获取全部管理员人员
   * @param {*} ctx
   */
  static async getManagers(ctx) {
    let msg = "";
    let data = [];
    try {
      const token = ctx.headers.authorization.split(" ")[1];
      const { authority } = verifyToken(token);

      if (authority === 4) {
        const adminList = await userModel
          .findAll({
            attributes: ["userName", "id"],
            where: {
              isDelete: false,
              authority: 3,
              departmentId: 0,
            },
          })
          .catch((err) => {
            msg = "查询失败，查询过程中出现意外";
            ctx.response.status = 500;

            console.log(red("[GET MANAGERS]: 查询过程中出现意外！"), err);
          });

        data = {
          adminList,
        };
        msg = "success";
        ctx.response.status = 200;

        console.log(blue("[GET MANAGERS]: 查询成功！"));
      } else {
        msg = "查询失败，用户权限值不足";
        ctx.response.status = 403;

        console.log(yellow("[GET MANAGERS]: 用户权限值不够"));
      }
    } catch (err) {
      msg = "token 过期或失效";
      ctx.response.status = 401;

      console.log(yellow("[GET MANAGERS]: TOKEN 过期或失效"), err);
    }
    ctx.response.body = baseController.renderJsonSuccess(msg, data);
  }

  /**
   * @description 查找特定的用户信息
   * @param {*} ctx
   */
  static async specificUser(ctx) {
    let msg = "";
    let data = [];

    const { id } = ctx.request.body;

    try {
      const token = ctx.headers.authorization.split(" ")[1];
      // TODO:权限判断

      const { authority } = verifyToken(token);

      const userInfo = await userModel
        .findByPk(id, {
          attributes: { exclude: ["pwd", "isDelete"] },
        })
        .catch((err) => {
          msg = "查询失败，查询过成功中出现意外";
          ctx.response.status = 500;

          console.log(
            red("[SPECIFIC USER]: 查询失败，查询过程中出现意外"),
            err,
          );
        });
      data = { userInfo };
    } catch (err) {
      msg = "token 过期或失效";
      ctx.response.status = 401;

      console.log(yellow("[SPECIFIC USER]: TOKEN 过期或失效"), err);
    }
    ctx.response.body = baseController.renderJsonSuccess(msg, data);
  }
}

module.exports = userController;
