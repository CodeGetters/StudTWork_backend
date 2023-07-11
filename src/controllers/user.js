/*
 * @Description-en:user controller
 * @Description-zh:用户中间层
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-06-29 23:29:57
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-11 16:59:03
 */
const baseController = require("./index");

const userModel = require("../models/user");

const { createToken, verifyToken } = require("../utils/token");

const { yellow, blue, green } = require("kolorist");

const { Op } = require("sequelize");

const dayjs = require("dayjs");

// const { getStatic } = require("../utils/localStatic");

class userController extends baseController {
  /**
   * @description 用户注册
   * @param {*} ctx
   */
  static async createUser(ctx) {
    let msg = "";
    let data = [];
    let userInfo = "";

    const { userName, pwd } = ctx.request.body;
    console.log(green("正在验证用户是否存在..."));

    const isExist = await userModel.findOne({
      attributes: ["userName"],
      where: {
        userName,
      },
    });

    console.log(green("验证完毕..."));

    // 检验是否存在
    if (isExist) {
      msg = "用户名已存在，注册失败";
      ctx.response.status = 409;

      console.log(yellow("[CREATE USER]:用户名已存在，注册失败"));
    } else {
      console.log(green("用户名不存在，正在进入下一步"));
      try {
        await userModel.create({
          userName,
          pwd,
          registerTime: `${dayjs().format("YYYY-MM-DD HH:mm")}`,
          // 超级管理员 4、管理员 3、普通用户 2、游客 1
          authority: 2,
          role: "普通用户",
          sex: "未知",
          isDelete: false,
        });
        ctx.response.status = 200;

        // 获取用户注册的相关信息
        const lastUser = await userModel.findOne({
          order: [["id", "DESC"]],
          attributes: ["id", "userName", "authority", "role", "sex"],
        });
        // token 需要携带的用户信息
        userInfo = {
          id: lastUser.dataValues.id,
          userName,
          authority: lastUser.dataValues.authority,
          role: lastUser.dataValues.role,
          sex: lastUser.dataValues.sex,
          isDelete: lastUser.dataValues.isDelete,
        };
        data = { token: await createToken(userInfo) };
        msg = "用户注册成功";
        console.log(blue("用户创建成功！"));
      } catch (err) {
        msg = "用户创建时失败，请重试！";
        console.log(yellow("用户创建时失败，请重试！"));
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

    const { userName, pwd } = ctx.request.body;

    // 根据用户名查询用户的 id、账号、密码、权限等级字段
    const userExist = await userModel.findOne({
      attributes: ["id", "userName", "pwd", "authority", "sex"],
      where: {
        userName,
      },
    });
    // 没有查询到该用户
    if (userExist === null) {
      msg = "登录失败，用户名不存在";
      ctx.response.status = 404;

      console.log(yellow("[USER LOGIN]:用户名不存在，用户登录失败"));
      // 密码错误
    } else if (pwd !== userExist.dataValues.pwd) {
      msg = "登录失败，密码错误";
      ctx.response.status = 401;

      console.log(yellow("[USER LOGIN]:用户名不存在，用户登录失败"));
    } else {
      // token 携带的用户信息
      userInfo = {
        id: userExist.dataValues.id,
        userName: userExist.dataValues.userName,
        authority: userExist.dataValues.authority,
        sex: userExist.dataValues.sex,
      };
      console.log(blue("[USER LOGIN]:登录成功"));

      data = {
        token: createToken(userInfo),
        userInfo,
      };
    }

    ctx.body = baseController.renderJsonSuccess(msg, data);
  }

  /**
   * @description 查找权限内的所有用户 比如 用户 A 权限等级为 3，他能查询比它权限等级小的所有用户 2 1
   * @param {*} ctx
   */
  static async getUser(ctx) {
    let msg = "";
    let data = "";
    let userList = "";
    let validToken = "";

    try {
      // 从请求头中获取 token
      const token = ctx.headers.authorization.split(" ")[1];
      validToken = verifyToken(token);
    } catch (err) {
      console.log(yellow("[FIND ALLUSER]:Token 已过期"));
    }

    /**
     * @description 根据用户的权限值获取权限下的所有用户
     * @param {*} userAuthority
     * @returns
     */
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
          authority: {
            // Op.lte 来表示小于等于运算符 gt:> gte:>= lt:<
            [Op.lt]: userAuthority,
          },
        },
      });
      return res;
    };
    if (validToken) {
      const userAuthority = validToken.authority;

      // 根据权限值不同做不用的事情 游客-用户-管理员-超级管理员
      if (userAuthority === 1) {
        msg = "用户权限等级不够，查询失败";
        ctx.response.status = 403;
      } else {
        userList = await searchUser(userAuthority);
        msg = "查询成功";
        ctx.response.status = 200;
      }

      data = {
        users: userList,
      };
    } else {
      msg = "token 已失效，请重新登录";
      ctx.response.status = 404;
    }
    ctx.body = baseController.renderJsonSuccess(msg, data);
  }

  /**
   * @description 用户修改自己账户的密码
   * @param {*} ctx
   */
  static async updatePwd(ctx) {
    let msg = "";

    try {
      // 从请求头中获取 token
      const token = ctx.headers.authorization.split(" ")[1];
      verifyToken(token);
      console.log(blue("[FIND ALLUSER]:Token 有效"));
    } catch (err) {
      console.log(yellow("[FIND ALLUSER]:Token 已过期"));
    }
    // TODO：提取 token 中携带的信息与需要修改的用户进行比较---身份验证
    const { userName, newPwd, oldPwd } = ctx.request.body;

    // 根据用户名进行查该用户的相关信息
    const userInfo = await userModel.findOne({
      attributes: ["id", "userName", "pwd"],
      where: {
        userName,
      },
    });
    const original = userInfo.dataValues;
    console.log("test", original);

    if (original.pwd !== oldPwd) {
      console.log("修改失败", original);
      msg = "原密码错误，修改失败";
      ctx.response.status = 401;
    } else {
      // 更新密码
      try {
        await userModel.update(
          {
            pwd: newPwd,
          },
          {
            where: {
              id: original.id,
            },
          },
        );
      } catch (err) {
        console.log("失败：", err);
        msg = "修改时发生错误，请重试";
        ctx.response.status = 500;
      }

      msg = "修改成功，请使用新密码重新登录";
      ctx.response.status = 200;
    }
    ctx.body = baseController.renderJsonSuccess(msg);
  }

  /**
   * @description 用户信息更新
   * @param {*} ctx
   */
  static async updateUser(ctx) {
    let msg = "";

    // 可以修改的信息有：用户名、性别
    // TODO:先鉴权在操作
    // const { newInfo } = ctx.request.body;
    let validToken = "";

    // const { userInfo } = ctx.request.body;

    // 判断 token
    try {
      // 从请求头中获取 token
      const token = ctx.headers.authorization.split(" ")[1];
      validToken = verifyToken(token);
      console.log("token 正常");
    } catch (err) {
      console.log(yellow("[FIND ALLUSER]:Token 已过期"));
    }
    console.log("validToken:", validToken.userName);

    // const userInfo = await userModel.findOne({
    //   attributes: ["userName"],
    //   where: {
    //     userName: validToken.userName
    //   },
    // });

    // if (isExist) {
    //   console.log("用户名已经存在，修改失败");
    // } else {
    //   console.log("修改成功");
    // }

    try {
      // 更新用户的用户信息
      await userModel.update(
        {
          // 可以更新的信息
          userName: validToken.userName,
        },
        {
          where: {
            id: validToken.id,
          },
        },
      );
    } catch (err) {
      console.log("更新时失败", err);
    }

    // 如果没有找到该用户，更新失败
    // 如果该用户 token 失效，更新失败
    // 用新信息覆盖旧的信息
    // console.log("userInfo:", userInfo);

    ctx.response.body = baseController.renderJsonSuccess(msg);
  }
}

module.exports = userController;

// TODO：用户登录时返回用户的 ip 地址(转成在那个省)，并将登录位置信息记录起来
