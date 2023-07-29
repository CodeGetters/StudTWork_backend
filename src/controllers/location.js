/*
 * @Description-en:
 * @Description-zh:
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-20 22:54:11
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-20 22:56:02
 */
const baseController = require("./index");

const locationModel = require("../models/location");

class locationController extends baseController {
  static async createLocation(ctx) {
    ctx.response.body = baseController.renderJsonSuccess();
  }

  // 根据用户 id 查询用户的最后一次登录信息
  static async getLastInfo(ctx) {
    ctx.response.body = baseController.renderJsonSuccess();
  }
}

module.exports = locationController;
