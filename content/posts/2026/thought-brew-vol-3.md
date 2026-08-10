---
title: "思绪混酿 Vol.3"
date: "2026-08-09T23:45:09+08:00"
draft: false
pin: false
summary: ""
tags: []
categories: []
---

把定期刊物的命名改掉了，灵感来源于塔罗牌『节制』，原因是发现只记录生活内容特别容易变成无聊的流水账，想多写一些自己看到的有趣的文章和刊物，放一些思考后的产物进来；

<!--more-->

## 漫游

### Before Sunrise

{{< neodb "https://neodb.social/movie/1aF8CzGEybUgcQ8uSkL0Iw" >}}

以对白为主的电影，看完才发现，和一个能够畅所欲言的人在一起散步是非常宝贵的体验，唱片店内小心翼翼的对视，餐馆的 Phone Call Play 都是名场面。


### Before Sunset

{{< neodb "https://neodb.social/movie/4583MmZvob6TDbu0Yf111q" >}}

Before 系列的第二部，两人成熟后的再次相遇，终究还是放不下彼此，写了很多成年人对爱情的理解，同时台词的水准依然在线：

- Even being alone it's better than sitting next to your lover and feeling lonely.
- I guess when you're young, you just believe there'll be many people with whom you'll connect with. Later in life, you realize it only happens a few times.

总之，Before 三部曲给我的观感都很好，许多人认为第三部更加真实，但是我最喜欢的还是前两部。


## 真男人为什么应该练翘臀？

<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/episode/29Jhj7eL08UjfbmQMUio6e?utm_source=generator&si=04ef7499104d45e8" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

听完这期播客，启发还挺大的，作为健身小白，确实更喜欢练习肩背胸，因为想要更快的见到成效满足自己的虚荣心，臀腿肌肉承载了更多更加重要的功能，却往往被忽视，随即想要调整健身策略；

## 采样

### [In Defense of YAML.](https://opensource.posit.co/blog/2026-05-21_in-defense-of-yaml/)

作者比较详细地介绍了配置文件的简史，从 INI、XML、JSON 到如今主流的 YAML 和 TOML，强调 YAML 历史上比较臭名昭著的问题已经在后来的版本中被解决了，比如挪威事件：挪威的国家码 no 会被解析成布尔值 false, 以及 n 和 y 会被解析成 false 和 true，这些问题在 YAML 1.2 中其实都已经被解决了；

而 TOML 并不能说是对 YAML 的全方位升级，最大的缺点是配置层级的嵌套不易读，而且会产生大量的重复；总的来看，相对简单的配置文件，用 TOML 就好，层级深、复杂的配置，就用 YAML。


### [XDG 基本目录规范](https://specifications.freedesktop.org/basedir/latest/)

XDG 基本目录规范（XDG Base Directory specification）的作者是 Waldo Bastian, Allison Karlitskaya, Lennart Poettering 和 Johannes Löthberg，XDG 是指 Cross-Desktop Group, XDG 制作的规范并不是官方标准，各种项目不一定需要严格遵循这些规范；

basedir 讨论了类 Unix 系统下，软件应该怎么在 Home 中存放文件:

XDG_CONFIG_HOME：存放用户配置文件，用户可以更改调整软件行为，也可以迁移到别的设备上继续使用；
XDG_CACHE_HOME：存放 cache 文件，或者非必需的文件；
XDG_DATA_HOME：存放持久化的用户数据，比如用户文件没有指定保存位置的时候，这个路径可以作为默认的位置；
XDG_STATE_HOME：存放软件的状态记录，比如软件的操作历史，可以恢复的视图，打开的文件等，不应该放在用户数据里面的持久化数据；


## 消遣

### KPW6

![kindle paperwhite 12th generation](https://static.looechao.com/2026/kpw6.jpg)

以前读中学的时候用过 Kindle touch、KPW3，后续见证了 Boox 和 iReader 这类国产墨水屏阅读器的野蛮发展，看到豆豉说 Boox 在用一段时间之后总是容易出现卡死的问题，所以还是购入了 Kindle，是不能注册的版本，需要越狱才能正常使用。

其实对我来说，一个可以删除用户书籍，把用户书籍封面改成广告的官方系统，不能注册对我来说不算什么缺点，用 KPP 打补丁能完美解决未注册的提示，官方系统的好处是稳定、排版规范，在 Koreader 上想要调出同样的字体和排版效果比较费心，我现在只在 Koreader 上面看 EPUB 漫画，其他书通过 Calibre 传到官方系统。
