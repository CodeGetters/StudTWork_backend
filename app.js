/*
 * @Description:app 请求响应主体
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-06-18 20:30:52
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-09-13 20:36:30
 */
const koa = require("koa");
const cors = require("koa-cors");
const port = require("./src/config/globalConfig").port;
// const secret = require("./src/config/globalConfig").jwtOption.secret;
// const koaJwt = require("koa-jwt");
const bodyParser = require("koa-body").default;
const path = require("path");
const koaStatic = require("koa-static");

// https://github.com/koajs/koa-body/issues/215
// const bodyParser = require("koa-body");
// 报错：bodyParser is not a function

// https://github.com/koajs/convert/blob/master/README.md
// https://github.com/koajs/convert#migration
// const convert = require("koa-convert");

const app = new koa();

// 静态文件处理
app.use(koaStatic(path.join(__dirname, "./public")));

const Router = require("./src/router/index");

app.use(
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 设置所允许的HTTP请求方法
    allowHeaders: ["Content-Type", "Authorization", "Accept"], // 设置服务器支持的所有头信息字段
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"], // 设置获取其他自定义字段
  }),
);

// X-Response-Time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

// logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// response---这里开启后会使得路由失效
// app.use(async (ctx) => {
//   ctx.body = "hello world";
// });

// 获取 post 请求参数(解决 post 请求为 undefined)---顺序要在路由前
// https://blog.csdn.net/liu893100/article/details/106795429
app.use(
  bodyParser({
    enableTypes: ["json", "form", "text"],
    // 是否支持 multipart-formdate 的表单
    multipart: true,
  }),
);

// 启动路由
// 运行任何请求-get/post/put/delete 等
app.use(Router.routes(), Router.allowedMethods());

// 颁发 token
// app.use(
//   koaJwt({ secret }).unless({
//     path: [/^\/public/, /^\/login/, /^\/register/],
//   })
// );

// 处理 JWT 验证错误
// app.use(async (ctx, next) => {
//   try {
//     await next();
//   } catch (err) {
//     if (err.status === 401) {
//       ctx.throw(401, "Invalid token");
//     } else {
//       throw err;
//     }
//   }
// });

const { blue } = require("kolorist");

const webSocket = require("ws");
let server = app.listen(port, () => {
  console.log(blue(`http://localhost:${port}`));
});

const ws = new webSocket.Server({ server });
ws.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("接收到前端的消息内容:%s", message);
  });
});
