#!/bin/bash

# 删除 public 下除了 .git 之外的所有文件
cd public
find . -not -path './.git/*' -not -name '.git' -delete
cd ..

# 使用生产环境构建
HUGO_ENV=production hugo

# 进入 public 目录
cd public

# Git 操作
git add .

# 提示输入 commit 信息
echo "Enter commit message:"
read commit_msg

git commit -m "$commit_msg"
git push origin main

# 返回上级目录
cd ..

echo "Deploy completed!"
