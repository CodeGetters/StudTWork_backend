/*
 * @Description-en:user controller
 * @Description-zh:用户中间层
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-06-29 23:29:57
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-20 23:35:29
 */
const baseController = require("./index");

const userModel = require("../models/user");

const { createToken, verifyToken } = require("../utils/token");

const { yellow, blue, green, red } = require("kolorist");

const { Op } = require("sequelize");

const dayjs = require("dayjs");

const { createLocation } = require("../utils/location");

/*
 限制：
 1、token 必须没有过期且有效
 2、被删除的用户不能进行操作
*/

// TODO：用户登录时返回用户的 ip 地址(转成在那个省)，并将登录位置信息记录起来

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
        });
        await createLocation(userName, city, province, dayjs());

        // 获取用户注册的相关信息---查询最后一个用户信息
        const lastUser = await userModel.findOne({
          // 降序排序
          order: [["id", "DESC"]],
          attributes: ["id", "authority", "role", "sex"],
        });
        const { id, authority, role, sex } = lastUser;

        // token 需要携带的用户信息
        userInfo = { id, userName, authority, role, sex };
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

    console.log("-------city-----", city);
    console.log("-------province-----", province);

    // 根据用户名查询用户的 id、账号、密码、权限等级、是否注销 字段
    const userExist = await userModel.findOne({
      attributes: ["id", "userName", "pwd", "authority", "sex"],
      where: {
        userName,
        isDelete: false,
      },
    });

    if (userExist === null) {
      msg = "登录失败，用户名不存在";
      ctx.response.status = 404;

      console.log(yellow("[USER LOGIN]:用户名不存在，用户登录失败"));
    } else if (pwd !== userExist.dataValues.pwd) {
      msg = "登录失败，密码错误";
      ctx.response.status = 401;

      console.log(yellow("[USER LOGIN]:用户名不存在，用户登录失败"));
    } else {
      const { id, sex, authority } = userExist;

      // token 携带的用户信息
      userInfo = { id, userName, authority, sex };
      data = {
        token: createToken(userInfo),
        userInfo,
      };
      msg = "success";
      ctx.response.status = 200;

      console.log(blue("[USER LOGIN]:登录成功"));
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
        attributes: [
          "id",
          "userName",
          "authority",
          "role",
          "registerTime",
          "sex",
        ],
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
          ctx.response.status = 401;
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
        console.log(red("[UPDATE USER]:修改失败，修改时发生错误"));
      }
    } catch (err) {
      msg = "token 过期或无效";
      ctx.response.status = 401;
      console.log(yellow("[UPDATE USER]:Token 已过期"));
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
    // TODO：管理员向超级管理员发出待处理事件，超级管理员判断删除
    ctx.response.body = baseController.renderJsonSuccess(msg);
  }
}

module.exports = userController;
