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
