<p align="center">
    <img src="/public/images/favicon.svg">
</p>

<h1 align="center">StudTWork</h1>

---

> 本项目是 StudTWork 的后端接口，采用了 sequelize ORM (对象关系映射) 进行操作 mysql 数据库。

[![CodeTime badge](https://img.shields.io/endpoint?style=social&url=https%3A%2F%2Fapi.codetime.dev%2Fshield%3Fid%3D5193%26project%3D%26in%3D0)](https://codetime.dev)

## 项目结构

```txt
$ tree -I 'node_modules'
.
|-- LICENSE
|-- README.md
|-- app.js               // 项目入口文件
|-- package.json
`-- src
    |-- controllers      //控制器(用于接收用户模块的接口请求)
    |-- db               // 数据库配置
    |-- config           // 全局配置文件
    |-- models           // 数据库模型(相关表结构)
    |-- log              // log 日志存放
    |-- utils            // 工具函数
    `-- router           // 路由
```

## 使用

```shell
# 引入依赖
$ yarn install

# 运行
$ yarn run start

# 如果你熟悉 pm2 也可以
$ yarn run pm2
```

完成以上操作后，你会发现终端会出现报错。请不用担心，这是正常的，接下来我们先连接本地 mysql 数据库

- 在项目根目录下创建 .env.development 文件(建议现在本地 mysql 中创建'studTwork'数据库)，并在该文件中写入(或者直接修改 src/globalConfig.js 文件)

```env
KOA_DATABASE_USERNAME="数据库登录名"
KOA_DATABASE_PWD="数据库登录密码"
# 数据库 host(本地默认 localhost)
KOA_DATABASE_HOST="localhost"
KOA_DATABASE_DATABASE="数据库名"

KOA_JWT_SECRET="StudTWork"
```

如果配置正确，那么控制台会出现 mysql 连接成功，但是仍然会有许多报错，这是因为你还没有建表

- 将 src/models 中每一个建表模型成功创建在本地

先将 user 表创建好后在创建其他表(只需要将自动建表语句中的 force 改为 true 即可创建)。

完成假表后，终端会显示正常，这时候你就可以愉快的使用了😜
