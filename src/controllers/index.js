/*
 * @Description-en:public class
 * @Description-zh:公共类
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-06-29 23:30:08
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-01 11:20:37
 */

// controller 主要负责对数据库进行操作
// controller主要存放操作和数据处理的一些逻辑

// 定一个公共类，类里有一个 renderJsonSuccess 方法，方便返回数据
class baseController {
  static renderJsonSuccess(msg = "", data = []) {
    return {
      msg,
      data,
    };
  }
}

module.exports = baseController;
