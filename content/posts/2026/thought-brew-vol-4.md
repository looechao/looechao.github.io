---
title: "Thought Brew Vol 4"
date: 2026-10-24T15:50:31+08:00
draft: false
pin: false
summary: ""
tags: []
categories: []
---

国庆期间去了北京和澳门，旅行对我来说像是一次 Reset，但是返工后总感觉节奏有点乱，闲暇的时间还是在看剧和看电影，可能要慢慢地调整，找到更好的状态吧？看过的和读过的，我会尽量记录下来：

<figure style="max-width: 650px; margin: 0 auto;">
  <img
    src="https://static.looechao.com/2026/zhuhai-grand-theater.jpg"
    alt="珠海日月贝"
    loading="lazy"
    style="width: 100%; height: auto;">
  <figcaption><a href="https://zh.wikipedia.org/wiki/珠海大劇院">珠海日月贝</a>，位于野狸岛，非常适合秋日散步，吹海风。</figcaption>
</figure>

<!--more-->

## 漫游

### The Office

{{< neodb "https://neodb.social/tv/2IE12aPRm9r0xWgnFL6AmK" >}}

从各种切片开始入坑的，看了之后就一发不可收拾，伪纪录片的形式可以让镜头语言有更多的表达空间，人物设定也非常丰满和立体，我最喜欢的是 Dwight，古怪又有趣，最后一季中 Andy 说过一段话让我印象深刻：

<figure style="max-width: 480px; margin: 0 auto;">
  <img
    src="https://static.looechao.com/2026/the-office-andy-good-old-days.jpg"
    alt="The Office: good old days"
    loading="lazy">
  <figcaption>Andy talks about Good Old Days</figcaption>
</figure>

为什么人总是在失去的时候才能发现过去的美好？

### 奥德赛

{{< neodb "https://neodb.social/movie/5Sd0Dw4oPFeRC5uF64tqQ4" >}}

在 IMAX 影院看了两遍，我觉得比[《奥本海默》](https://zh.wikipedia.org/wiki/奧本海默_%28電影%29)更好看，配乐和画面都很有史诗感，发现一个有趣的地方是，有些时候，当角色有违反 [Xenia](https://en.wikipedia.org/wiki/Xenia_%28Greek%29) 的念头时，偶尔会有雷鸣声，也许当时的人们真的会觉得雷鸣是宙斯的愤怒，翻滚的海浪是波塞冬的惩罚……

[忒勒玛科斯](https://zh.wikipedia.org/wiki/忒勒玛科斯)的导师叫做门托耳，英文中表示导师的 [mentor](https://www.etymonline.com/word/mentor) 一词正是源自这里。

### 心灵捕手

{{< neodb "https://neodb.social/movie/0Wl134TQb5X1u1RzgwWEJu" >}}

《奥德赛》上映之后，我看了一些[马特·达蒙](https://zh.wikipedia.org/wiki/马特·达蒙)的访谈，发现他说话非常清晰、有条理，后来才知道他曾在哈佛大学英文系读书，难怪如此。

《心灵捕手》的剧本是马特·达蒙和好友一起创作的，电影中的 Will 具有和[拉马努金](https://zh.wikipedia.org/wiki/斯里尼瓦瑟·拉马努金)类似的天才般的数学直觉，但是童年受到的创伤让他难以面对自己，电影里最让人感动的是心理学家 Sean 相关的剧情，两人在湖边的对话，在办公室打开 Will 心房的瞬间，都很让人触动。

另外，结局时，好朋友们一起组装了一辆车送给了 Will，这种友谊太可贵了。 

## 采样

### Tiling Window Manager

人一旦体会到平铺式窗口管理工具的优雅之后，就很难戒掉它们了。我最开始使用的是 [AeroSpace](https://github.com/nikitabobko/AeroSpace)，默认的键位就很好用，适合入门。

后来又发现了 [rift](https://github.com/acsandmann/rift)，它的可定制程度更高，我把 w 作为工作专用的 Workspace，放置工作 IM，b 用来放置浏览器，d 可以放各类 dashboard，数字键分配给 Terminal 和 IDE，m 留给音乐播放器。

搭配 [Vimium](https://vimium.github.io/) 这样的浏览器扩展，我的绝大多数操作都可以通过键盘完成，有一种独特舒适的体验，我的 rift 配置节选：

``` toml
workspace_names = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "A", "B", "C", "D", "E", "F", "G",
  "I", "M", "N", "O", "P", "Q", "R", "S",
  "T", "U", "V", "W", "X", "Y", "Z",
]

[modifier_combinations]
shift_alt = "Alt + Shift"

[keys]
"Alt + 1" = { switch_to_workspace = 0 }
"Alt + 2" = { switch_to_workspace = 1 }
"Alt + A" = { switch_to_workspace = 9 }

"shift_alt + 1" = { move_window_to_workspace = 0 }
"shift_alt + 2" = { move_window_to_workspace = 1 }
"shift_alt + A" = { move_window_to_workspace = 9 }
```



### [Helium](https://helium.computer/) 和密码管理工具

最近把 Chrome 浏览器切换到了 Helium，一款隐私优先的 [Chromium](https://www.chromium.org/Home/) Fork，不需要登录账号，移除了大部分 Google 服务和依赖，用起来十分清爽。

由于 Helium 不再内置 Google 密码管理器，我试了 [KeePass](https://keepass.info/)，它最大的特点是本地管理，一个加密的 `.kdbx` 数据库文件就可以保存所有的密码，把它放到 iCloud 或者 Google Drive 就可以做多设备同步。

在桌面端，可以用 [KeePassXC](https://keepassxc.org/) 管理数据库，再配合 [KeePassXC-Browser](https://github.com/keepassxreboot/keepassxc-browser) 浏览器扩展做自动填充，虽然这个方案能让用户完全掌控自己的数据，但需要额外常驻一个桌面客户端，对我来说还是有点麻烦。

最终我是换到了 [Bitwarden](https://bitwarden.com/)，日常使用只需要安装浏览器扩展，不得不感慨数据自主权和方便性有时候很难同时做到极致。

### [Mole](https://mole.fit/)

电脑磁盘清理工具，现在 [Windows 版本](https://mole.fit/windows)发布了，对于懒人十分友好，很佩服 [Tw93](https://github.com/tw93) 的品味和动手能力，[CLI 版本](https://github.com/tw93/Mole)是开源免费的：

``` bash
➤ 1. Clean        Free up disk space
  2. Uninstall    Remove apps completely
  3. Optimize     Refresh caches and services
  4. Analyze      Explore disk usage
  5. Status       Monitor system health

↑↓  |  Enter  |  M More  |  V Version  |  T TouchID  |  U Update  |  Q Quit
```

大部分核心功能都是可以直接使用的，可以用 `mo clean` 清理磁盘，用 `mo uninstall` 卸载软件，推荐给对硬盘空间敏感的用户使用！

## 京中觅食

<div style="display: flex; align-items: flex-start; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 12px;">
  <figure style="flex: 0 0 auto; width: auto; margin: 0; scroll-snap-align: start;">
    <img
      src="https://static.looechao.com/2026/beijing-roast-duck.jpg"
      alt="烤鸭"
      loading="lazy"
      style="height: 240px; width: auto; max-width: none;">
    <figcaption>烤鸭</figcaption>
  </figure>

  <figure style="flex: 0 0 auto; width: auto; margin: 0; scroll-snap-align: start;">
    <img
      src="https://static.looechao.com/2026/beijing-zhajiang-noodles.jpg"
      alt="炸酱面"
      loading="lazy"
      style="height: 240px; width: auto; max-width: none;">
    <figcaption>炸酱面</figcaption>
  </figure>

  <figure style="flex: 0 0 auto; width: auto; margin: 0; scroll-snap-align: start;">
    <img
      src="https://static.looechao.com/2026/beijing-breakfast.jpg"
      alt="豆汁"
      loading="lazy"
      style="height: 240px; width: auto; max-width: none;">
    <figcaption>豆汁</figcaption>
  </figure>
</div>

北京的美食比想象中的要好吃很多，我是吃面长大的，即使是连锁店的炸酱面也很好吃，注意第一次吃要小心放酱，小心咸。

