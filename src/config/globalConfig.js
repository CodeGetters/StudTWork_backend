/*
 * @Description-en:global configuration entry file
 * @Description-zh:全局配置入口文件
 * @Author: CodeGetters
 * @version:
 * @Date: 2023-06-29 22:47:22
 * @LastEditors: CodeGetters
 * @LastEditTime: 2023-07-03 10:49:51
 */
const defineConfig = {
  port: 5000,
  dataBase: {
    port: 3306,
    username: "root",
    password: "MySQL123456!",
    host: "localhost",
    dialect: "mysql",
    database: "studTwork",
  },

  jwtOption: {
    secret: "StudTWork",
    validTime: "1d",
    carryInfo: {},
  },
};

module.exports = defineConfig;
