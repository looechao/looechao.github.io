+++

title = 'Hexo框架的博客搭建小记'
date = 2023-02-25T21:31:13+08:00
draft = false
summary = "第一次尝试建立hexo框架的站点"
tags = ["笔记", "hexo"]

+++

## 概述：

记录了使用Hexo框架+github pages搭建个人博客的流程，只需几分钟就可以生成并托管自己的博客文章

## 流程：

### 安装Hexo依赖软件

-   Node.js (建议使用12.0以上版本)
-   Git

### 安装结果检验

-   打开Git Bash或者cmd
-   `node -v`
-   `npm -v` 

正常显示出node和npm的版本 安装成功

### 安装淘宝镜像源

在Git Bash中运行如下命令：

```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

安装后查看当前版本命令：

```
cnpm -v
```

安装淘宝镜像源的目的:提高下载速度

### 安装Hexo-cli

在Git Bash中执行如下命令安装Hexo客户端：

```
cnpm install -g hexo-cli
```

查看Hexo版本：

```
hexo -v
```

### 创建并初始化Blog文件

管理员模式下在Git Bash中执行如下命令：

```
hexo init
```

使用本地端口部署页面：

```
hexo s
```

### 将文件部署到github上

-   在github上新建库，库名必须和自己github的id相同![pic1](https://static.looechao.com/picserver/702de09807174db5a90a760207deb808%7Etplv-k3u1fbpfcp-zoom-1.png)
-   在blog目录下安装git部署插件：

```
cnpm install --save hexo-deployer-git
```

-   设置_config.yml

```
deploy: 
type: git
repo: https://github.com/looe327/looe327.github.io.git
branch: master
```

-   部署：

```
hexo d
```

## 问题汇总：

### 图床图片无法显示的问题解决方法：

-   找到index.ejs文件，路径如下：

```
└──hexo-theme-aurora (当前使用的主题文件夹)
   └──layout
      └──index.ejs
```

-   在**index.ejs**的头部中加入如下内容：

```
<meta name="referrer" content="no-referrer" />
<meta http-equiv="Content-Security-Policy" ontent="upgrade-insecure-requests">
```

## 参考连接：

<https://www.bilibili.com/video/BV1Yb411a7ty/> 

[http://30daydo.com/article/4429](http://30daydo.com/article/44296)