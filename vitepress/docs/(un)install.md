---
title: STranslate
titleTemplate: 安装卸载
---

# 安装

## 下载

### 直接下载

[前往下载](https://github.com/STranslate/STranslate/releases)

### Scoop

1. 安装Scoop [Scoop](https://scoop.sh/)
2. 添加源并安装`STranslate`
3. [scoop.sh](https://scoop.sh/#/apps?q=STranslate)

```shell
scoop bucket add extras
scoop install extras/stranslate
```

## 默认方式(推荐)

[Release](https://github.com/STranslate/STranslate/releases) 直接下载最新版

-  STranslate-win-Setup.exe: 安装版，安装位置在`C:\Users\{YourName}\AppData\Local\STranslate`，默认配置在 `C:\Users\{YourName}\AppData\Roaming\STranslate`
-  STranslate-win-Portable.zip: 便携版，默认配置在软件根目录下的 `PortableConfig`

> 如果提示下载.net 10 runtime 跟随引导安装即可「**.NET Desktop Runtime**」
> 下载地址：https://dotnet.microsoft.com/en-us/download/dotnet/10.0

# 卸载

- 若是安装版，请删除配置 `C:\Users\{YourName}\AppData\Roaming\STranslate`，随后使用控制面板或者其他工具卸载即可，软件不写注册表
- 若是便携版，直接删除软件目录即可
