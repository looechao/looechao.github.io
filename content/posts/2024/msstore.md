---
title: 用Powershell直接安装MicrosoftStore的应用
date: "2024-03-19T14:40:13+08:00"
draft: false
summary: 没有商店也可以安装应用
tags:
  - 笔记
  - Microsoft Store
---
很多人都喜欢禁用windows更新，禁用更新后应用商店应该是打不开的

其实用 powershell 安装 appx 也可以：

#### 下载appx安装包
- 我这里以EasyConnect为例，先去找到网页端对应的链接

<div style="width: 80%; margin: auto;">
    <img src="https://static.looechao.com/ms1.png" alt="shotonspf" style="width: 100%;" />
</div>

- 把对应的链接复制到online link generator 里

  Generation Project 站点：https://store.rg-adguard.net/

- 搜索到的Files里的 .appx 后缀的安装包

<div style="width: 80%; margin: auto;">
    <img src="https://static.looechao.com/ms2.png" alt="shotonspf" style="width: 100%;" />
</div>

#### 用Powershell安装应用

  需要用到的命令格式如下：

  ```powershell
     Add-AppxPackage -Path C:\path-to-app\app-name.appx
  ```
- 输入完毕后按回车，开始部署：
<div style="width: 80%; margin: auto;">
    <img src="https://static.looechao.com/ms3.png" alt="shotonspf" style="width: 100%;" />
</div>
- 等待进度结束就安装成功了
<div style="width: 40%; margin: auto;">
    <img src="https://static.looechao.com/ms4.png" alt="shotonspf" style="width: 100%;" />
</div>