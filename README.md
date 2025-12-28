## 构建

- 前端环境
	- Node.js(>=18.20.1)
	- Npm(>=10.5.0)/Yarn(>=v1.22.22)
- 开发工具
	- VsCode

### 安装前端环境

> 推荐使用 [nvm](https://github.com/coreybutler/nvm-windows) 安装配置 Node.js，详细教程可参考 [windows](https://juejin.cn/post/7093787595951308836)、[macos](https://blog.csdn.net/CaptainJava/article/details/83866880)

安装好`nvm`之后使用`cmd`安装`Node.js(18.20.1)`

<details>

<summary>网络不好的话请换源</summary>

阿里源
```shell
nvm npm_mirror https://npmmirror.com/mirrors/npm/
nvm node_mirror https://npmmirror.com/mirrors/node/
```

其他源：[nvm 切换国内镜像](https://nvm.p6p.net/use/mirror.html)

</details>

```shell
# 安装 nodejs
nvm install 18.20.1

# 等待结束

# 使用 nodejs
nvm use 18.20.1

# 检查版本
node -v
# 输出：v18.20.1

npm -v
# 输出：10.5.0
```

### 编译项目

`VsCode`打开项目文件夹使用`Ctrl`+`J`/`Command`+`J`打开终端进行编译

```shell
# 开始编译，网不好的话请尝试配置代理或者参考上面换源
npm run dev

# 编译成功查看输出
 vitepress v1.0.0-rc.45

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### 预览编译效果

根据编译输出结果浏览器访问 `http://localhost:5173/` 即可看到网页内容


---

### 提交 PR

[Bilibili](https://www.bilibili.com/video/BV1Qp4y1T797)
