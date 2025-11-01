---
allowed-tools: Bash(git stash:*), Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(dart format:*), Bash(flutter test:*)
description: 创建 git 提交
---

# Git 提交命令

简单的 git 提交工作流程，遵循项目要求。

## 项目要求
- **AI 提交标签**: 所有提交消息必须以 `[ClaudeCode]` 标签开头
- **格式**: 提交消息使用英文

## 执行任务
1. 暂存未暂存的更改，应该使用 `-k` 保持索引
2. 运行 dart format 命令，并暂存更改
3. 查看暂存的更改并使用正确的 ClaudeCode 格式提交
4. 恢复暂存的更改
5. 在最终任务摘要中重复提交消息

## 提交消息示例:
```
[ClaudeCode] feat: add sheet request button to search pages
[ClaudeCode] fix: resolve null pointer exception in user profile
[ClaudeCode] refactor: improve code organization in payment module
[ClaudeCode] style: apply dart format to entire codebase
[ClaudeCode] docs: update README with new API endpoints
```

