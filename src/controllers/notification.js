/*
 * @Description-en:notification controller
 * @Description-zh:通知控制器
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-05 17:31:43
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-05 17:38:11
 */

const baseController = require("./index");

class notificationController extends baseController {
  // TODO：创建通知
  static async createNotification(ctx) {
    ctx.body = baseController.renderJsonSuccess();
  }

  // TODO:删除通知
  static async deleteNotification(ctx) {
    ctx.body = baseController.renderJsonSuccess();
  }

  // TODO:更新通知
  static async updateNotification(ctx) {
    ctx.body = baseController.renderJsonSuccess();
  }

  static async showNotification(ctx) {
    ctx.body = baseController.renderJsonSuccess();
  }
}

module.exports = notificationController;
