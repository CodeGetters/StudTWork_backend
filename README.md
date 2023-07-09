# KOA

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
    `-- router           // 项目路由
```

jsonwebtoken---生成 token
koa-jwt---对 jsonwebtoken 的进一步封装，实现检验

## realize koa2

[参考](https://juejin.cn/post/7125867746172076069#heading-13)

## 登录接口

## 颁发 token

## HTTP 状态码参考

- 200 OK：表示请求已成功处理，并且响应包含所需的数据。
- 400 Bad Request：表示请求无效或无法被服务器理解。
- 401 Unauthorized：表示请求需要身份验证。
- 403 Forbidden：表示服务器拒绝了请求。
- 404 Not Found：表示请求的资源不存在。
- 500 Internal Server Error：表示服务器遇到了一个错误，无法完成请求。
