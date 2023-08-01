/*
 * @Description-en:
 * @Description-zh:
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-20 22:54:11
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-29 15:15:17
 */
const baseController = require("./index");

const { yellow, blue } = require("kolorist");

const locationModel = require("../models/location");
const { verifyToken } = require("../utils/token");
const userModel = require("../models/user");

class locationController extends baseController {
  static async createLocation(ctx) {
    ctx.response.body = baseController.renderJsonSuccess();
  }

  // 根据用户 id 查询用户的最后一次登录信息
  static async getLastInfo(ctx) {
    let msg = "";
    let data = [];
    try {
      const token = ctx.headers.authorization.split(" ")[1];
      const { id } = verifyToken(token);
      // 返回信息
      const lastInfo = await locationModel
        .findOne({
          limit: 1,
          attributes: { exclude: ["userId"] },
          where: { userId: id },
          order: [["id", "DESC"]],
          include: [
            {
              model: userModel,
              attributes: [],
            },
          ],
        })
        .catch((err) => {
          msg = "查询时发生意外";
          ctx.response.status = 500;

          console.log(yellow("[LAST INFO]:查询时发生意外", err));
        });
      if (!msg) {
        data = { loginInfo: lastInfo };
        msg = "success";
        ctx.response.status = 200;

        console.log(blue("[LAST INFO]:登录信息查询成功"));
      }
    } catch (err) {
      msg = "token 无效或过期";
      ctx.response.status = 401;

      console.log(yellow("[LAST INFO]:Token 无效或过期："));
    }
    ctx.response.body = baseController.renderJsonSuccess(msg, data);
  }
}

module.exports = locationController;
