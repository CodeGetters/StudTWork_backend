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
}
