/*
 * @Description-en:global router
 * @Description-zh:全局路由
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-06-23 17:58:01
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-29 12:27:39
 */
const Router = require("@koa/router");

const router = new Router();

/* ----------------------user------------------------------ */

const userRoutes = require("./user");
router.use(userRoutes.routes());

/* ----------------------article------------------------------ */

const articleRoutes = require("./article");
router.use(articleRoutes.routes());

/* ------------------------department---------------------------- */

const departmentRoutes = require("./department");
router.use(departmentRoutes.routes());

/* ------------------------location---------------------------- */

const locationRoutes = require("./location");
router.use(locationRoutes.routes());

// router.get("/router", async (ctx, next) => {
//   ctx.type = "json";
//   ctx.body = {
//     code: 200,
//     message: "success!",
//   };
//   return next();
// });

module.exports = router;
