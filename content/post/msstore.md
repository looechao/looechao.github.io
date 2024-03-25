+++
title = '用Powershell直接安装MicrosoftStore的应用'
date = 2024-03-19T14:40:13+08:00
draft = false
summary = "没有商店照样可以安装应用"
tags = [ "笔记"]

+++
很多人都喜欢禁用windows更新，禁用更新后应用商店应该是打不开的

这种情况下就没有办法下载到ms store里的应用了吗？

其实只需要powershell和appx的安装包即可(o゜▽゜)o☆，这里我来演示一下我的操作方法：

#### 下载appx安装包
- 我这里以EasyConnect为例，先去找到网页端对应的链接

<div style="width: 80%; margin: auto;">
    <img src="https://raw.githubusercontent.com/looechao/blogimg/main/ms1.png" alt="shotonspf" style="width: 100%;" />
</div>

- 把对应的链接复制到online link generator 里

  Generation Project 站点：https://store.rg-adguard.net/

- 搜索到的Files里的 .appx 后缀的安装包

<div style="width: 80%; margin: auto;">
    <img src="https://raw.githubusercontent.com/looechao/blogimg/main/ms2.png" alt="shotonspf" style="width: 100%;" />
</div>

#### 用Powershell安装应用

  需要用到的命令格式如下：

  ```powershell
     Add-AppxPackage -Path C:\path-to-app\app-name.appx
  ```
- 输入完毕后按回车，开始部署：
<div style="width: 80%; margin: auto;">
    <img src="https://raw.githubusercontent.com/looechao/blogimg/main/ms3.png" alt="shotonspf" style="width: 100%;" />
</div>
- 等待进度结束就安装成功了
<div style="width: 40%; margin: auto;">
    <img src="https://raw.githubusercontent.com/looechao/blogimg/main/ms4.png" alt="shotonspf" style="width: 100%;" />
</div>