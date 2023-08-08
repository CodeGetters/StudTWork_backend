/*
 * @Description-en:
 * @Description-zh:
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-07-29 12:23:08
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-08-01 11:06:01
 */
const Router = require("@koa/router");

const router = new Router({ prefix: "/location" });

const locationController = require("../controllers/location");

// 获取最后一次信息
router.get("/getLastInfo", locationController.getLastInfo);

module.exports = router;
