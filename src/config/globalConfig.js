/*
 * @Description-en:global configuration entry file
 * @Description-zh:全局配置入口文件
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-06-29 22:47:22
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-15 20:24:02
 */

// 加载 env 文件中的环境变量
require("dotenv").config({
  path: ".env.development",
});

const defineConfig = {
  port: 443,
  dataBase: {
    port: 3306,
    dialect: "mysql",
    // host 地址
    host: process.env.KOA_DATABASE_HOST,
    // 数据库登录名
    username: process.env.KOA_DATABASE_USERNAME,
    // 数据库密码
    password: process.env.KOA_DATABASE_PWD,
    // 存储数据库
    database: process.env.KOA_DATABASE_DATABASE,
    // 是否允许 sequelize 打印 SQL 语句以及执行时间
    // boolean || console.warn || console.error(打印 SQL 语句和执行时间等信息到控制台的 warn||error 日志中)
    logging: true,
  },

  jwtOption: {
    // token 密钥
    secret: process.env.KOA_JWT_SECRET,
    // token 有效期
    validTime: "1d",
    carryInfo: {},
  },
};

module.exports = defineConfig;
