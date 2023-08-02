# Resolve Bug

## pnpm version is incompatible with "/vercel/path0"

- 描述

在进行 vercel 部署时候，突然发现一直部署失败，报错信息大概意思是我的 pnpm 不支持，期待是 >=8，实际得到的是 6

- 原因

后面查看了一下发现是 `pnpm-lock.yaml` 文件开头声明了 pnpm 版本是 6

```yaml
# 原因在这
# lockfileVersion: "6.0"

lockfileVersion: "8.0"

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false
```

- 解决

把 `pnpm-lock.yaml` 文件中的 `lockfileVersion` 值改为 8 就好了

## 数据库表关系

在创建用户表和部门表时，使用了多对一的关系。也就是说 一个部门包含多个用户。在这里时并没有注意到一个管理员也只能管理一个部门

在涉及到查询所有部门以及该部门的管理员信息时发现，如果有一个管理员同时管理多个部门时，在返回结果时只有在最后一个部门有用户信息。

所以在创建部门时要确定部门和用户的模型关联关系
