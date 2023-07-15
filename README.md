# KOA

[![CodeTime badge](https://img.shields.io/endpoint?style=social&url=https%3A%2F%2Fapi.codetime.dev%2Fshield%3Fid%3D5193%26project%3D%26in%3D0)](https://codetime.dev)

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

## using pm2

```shell
# 查看实时日志
pm2 logs

# 查看指定日志行数
pm2 logs --lines 200

# 查看监控信息
pm2 monit

# pm2 负载均衡

# 生成配置文件管理多个应用程序
pm2 ecosystem

# 开启启动
pm2 startup

# 保存
pm2 save

# Fork 模式
pm2 start app.js --name my-api # 程序名

# Cluster 模式
pm2 start app.js -i 0        # 将根据可用的 CPU 使用 LB 启动最大进程
pm2 scale app +3             # Scales `app` up by 3 workers
pm2 scale app 2              # Scales `app` up or down to 2 workers total

# Listing

pm2 list               # 显示所有进程状态
pm2 jlist              # 以原始JSON格式打印进程列表
pm2 prettylist         # 以美化的 JSON 格式打印进程列表

pm2 describe 0         # 显示指定进程的所有信息

pm2 monit              # 监控所有进程

# Logs

pm2 logs [--raw]       # 在流中显示所有进程日志
pm2 flush              # 清空所有日志文件
pm2 reloadLogs         # 重新加载所有日志

# Actions

pm2 stop all           # 停止所有进程
pm2 restart all        # 重启所有进程

pm2 reload all         # 将 0s 宕机机时间重新加载（对于 NETWORKED 应用程序）

pm2 stop 0             # 停止指定进程 id
pm2 restart 0          # 重启指定进程 id

pm2 delete 0           # 将进程从 pm2 列表中删除
pm2 delete all         # 将从 pm2 列表中删除所有进程

# Misc

pm2 reset <process>    # 重置元数据(重启时间…)
pm2 updatePM2          # 在内存中更新 pm2
pm2 ping               # 确保 pm2 守护进程已经启动
pm2 sendSignal SIGUSR2 my-app # 向脚本发送系统信号
```
