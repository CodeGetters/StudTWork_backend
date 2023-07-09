/*
 * @Description-en:address controller
 * @Description-zh:地址控制器
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-05 14:51:18
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-05 17:32:44
 */
const baseController = require("./index");

// const addressModel = require("../models/address");

class addressController extends baseController {
  // TODO:创建地址记录
  static async createAddress(ctx) {
    ctx.body = baseController.renderJsonSuccess();
  }

  // TODO:查询地址记录
  static async showInfo(ctx) {
    ctx.body = baseController.renderJsonSuccess();
  }
}

module.exports = addressController;
