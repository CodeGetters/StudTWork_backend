/*
 * @Description-en:
 * @Description-zh:
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-29 12:23:08
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-29 12:28:51
 */
const Router = require("@koa/router");

const router = new Router();

const locationController = require("../controllers/location");

// 获取最后一次信息
router.get("/location/getLastInfo", locationController.getLastInfo);

module.exports = router;
