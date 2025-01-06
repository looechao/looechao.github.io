+++
title = '怎么更好地学习LLM应用开发'
date = 2024-12-08T21:50:13+08:00
draft = false
summary = " "
pin = false
tags = [ "LLM",  "Agent", "杂谈"]
+++

我们很少会遇到一个机会，既新，又能把大家的起跑线拉到一个水平

大模型时代就是这样的一个机会

## 基础知识

熟悉一下 Transformer 和 Diffusion 的架构，了解大致框架，建立一些感性的认识

## 实践

1. **Prompt Engineering**，做一个小的plugin，调用一些公开的接口，写一个不少于500字的prompt，

   并且要建立一些datasets，懂得测试和评估它是否在绝大情况下是好用的，检测出在哪些场景下做的不好

2. **RAG**：建立一个调用Grok API 接口的 RAG System，看看是否会比 pplx 好用一点

3. **SFT\RLHF**：暂时没有配置条件

4. **试用一下多模态的模型**：文生图，图生视频，了解大概应用

5. **AI Agent**：搭建两个能够互相调用的 Agents, 观察是否有推理能力的提升，Memory 是否可持续和更新，同时试用一些多模态的功能，从目前用人单位的角度来看，搭建 Agent 的能力是越来越重要的

也许每天花一个多小时学习和尝试，一两个月的时间就能做出很多有意思的事情

AI Agent会发展到什么程度我们都不知道，也许当年面对iPhone的塞班工程师也是同样的感觉...

最起码我们可以先从个人的 project 做起

## 参考

[课代表立正的视频](https://www.youtube.com/watch?v=A12Z_CHi7PE)