#!/usr/bin/env python3
"""
TOML to YAML Front Matter Converter for Hugo
将 Hugo 文章的 TOML 格式 front matter 转换为 YAML 格式
使用标准库，无需外部依赖
"""

import os
import re
import sys
from pathlib import Path
from datetime import datetime


def parse_toml_value(value):
    """简单解析 TOML 值"""
    value = value.strip()

    # 布尔值
    if value == 'true':
        return True
    if value == 'false':
        return False

    # 数组 ["tag1", "tag2"]
    if value.startswith('[') and value.endswith(']'):
        array_content = value[1:-1].strip()
        if not array_content:
            return []
        items = []
        for item in re.findall(r'["\']([^"\']*)["\']', array_content):
            items.append(item)
        return items

    # 字符串 (去掉引号)
    if (value.startswith('"') and value.endswith('"')) or \
       (value.startswith("'") and value.endswith("'")):
        return value[1:-1]

    # 数字
    try:
        if '.' in value:
            return float(value)
        return int(value)
    except ValueError:
        pass

    # 日期时间 (保持原样)
    if re.match(r'\d{4}-\d{2}-\d{2}', value):
        return value

    return value


def parse_toml_front_matter(toml_str):
    """简单解析 TOML front matter"""
    data = {}

    for line in toml_str.split('\n'):
        line = line.strip()
        if not line or line.startswith('#'):
            continue

        # 匹配 key = value 格式
        match = re.match(r'^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$', line)
        if match:
            key = match.group(1)
            value = match.group(2)
            data[key] = parse_toml_value(value)

    return data


def to_yaml(data, indent=0):
    """将字典转换为 YAML 格式字符串"""
    lines = []
    indent_str = '  ' * indent

    for key, value in data.items():
        if isinstance(value, bool):
            lines.append(f"{indent_str}{key}: {str(value).lower()}")
        elif isinstance(value, list):
            if not value:
                lines.append(f"{indent_str}{key}: []")
            else:
                lines.append(f"{indent_str}{key}:")
                for item in value:
                    if isinstance(item, str):
                        lines.append(f"{indent_str}  - {item}")
                    else:
                        lines.append(f"{indent_str}  - {item}")
        elif isinstance(value, dict):
            lines.append(f"{indent_str}{key}:")
            lines.append(to_yaml(value, indent + 1))
        elif isinstance(value, str):
            # 如果字符串包含特殊字符，使用引号
            if ':' in value or '#' in value or value.startswith(' '):
                lines.append(f'{indent_str}{key}: "{value}"')
            else:
                lines.append(f"{indent_str}{key}: {value}")
        else:
            lines.append(f"{indent_str}{key}: {value}")

    return '\n'.join(lines)


def extract_front_matter(content):
    """提取 TOML front matter 和正文"""
    # 匹配 +++ ... +++ 格式的 front matter
    pattern = r'^(\+{3,})\s*\n(.*?)\n\1\s*\n(.*)$'
    match = re.match(pattern, content, re.DOTALL)

    if match:
        toml_content = match.group(2)
        body = match.group(3)
        return toml_content, body
    return None, content


def convert_file(file_path, dry_run=True):
    """转换单个文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 提取 front matter
        toml_content, body = extract_front_matter(content)

        if not toml_content:
            print(f"⏭️  跳过 {file_path} (没有 TOML front matter)")
            return False

        # 解析 TOML
        data = parse_toml_front_matter(toml_content)

        if not data:
            print(f"⚠️  {file_path} 的 front matter 为空")
            return False

        # 转换为 YAML
        yaml_content = to_yaml(data)

        # 组装新内容
        new_content = f"---\n{yaml_content}\n---\n{body}"

        if dry_run:
            print(f"\n🔍 预览 {file_path}")
            print("=" * 60)
            print("原始 TOML:")
            print(toml_content[:200])
            print("\n转换后 YAML:")
            print(yaml_content)
            print("=" * 60)
        else:
            # 写入文件
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ 已转换 {file_path}")

        return True

    except Exception as e:
        print(f"❌ 处理 {file_path} 时出错: {e}")
        import traceback
        traceback.print_exc()
        return None


def convert_directory(directory, dry_run=True, exclude_dirs=None):
    """批量转换目录下的所有 markdown 文件"""
    if exclude_dirs is None:
        exclude_dirs = []

    content_dir = Path(directory)
    all_md_files = list(content_dir.rglob("*.md"))

    # 过滤掉排除目录中的文件
    md_files = []
    for md_file in all_md_files:
        should_exclude = False
        for exclude_dir in exclude_dirs:
            if exclude_dir in md_file.parts:
                should_exclude = True
                break
        if not should_exclude:
            md_files.append(md_file)

    print(f"找到 {len(md_files)} 个 markdown 文件 (排除了 {len(all_md_files) - len(md_files)} 个)\n")

    converted = 0
    skipped = 0
    failed = 0

    for md_file in md_files:
        result = convert_file(md_file, dry_run)
        if result is True:
            converted += 1
        elif result is False:
            skipped += 1
        else:
            failed += 1

    print("\n" + "=" * 60)
    print(f"📊 转换统计:")
    print(f"   ✅ 成功: {converted}")
    print(f"   ⏭️  跳过: {skipped}")
    print(f"   ❌ 失败: {failed}")
    print("=" * 60)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='转换 Hugo 文章的 front matter 格式 (TOML → YAML)')
    parser.add_argument('path', help='文件或目录路径')
    parser.add_argument('--execute', action='store_true',
                       help='实际执行转换（默认只预览）')
    parser.add_argument('--exclude', nargs='+', default=[],
                       help='要排除的目录名（如 _drafts）')
    parser.add_argument('-y', '--yes', action='store_true',
                       help='跳过确认提示，直接执行')

    args = parser.parse_args()

    path = Path(args.path)
    dry_run = not args.execute

    if dry_run:
        print("🔍 预览模式 (使用 --execute 实际执行转换)\n")
    else:
        print("⚠️  执行模式 - 将修改文件！\n")
        if not args.yes:
            response = input("确认要转换所有文件吗？(yes/no): ")
            if response.lower() != 'yes':
                print("已取消")
                sys.exit(0)
        else:
            print("自动确认模式 (-y)\n")

    if args.exclude:
        print(f"排除目录: {', '.join(args.exclude)}\n")

    if path.is_file():
        convert_file(path, dry_run)
    elif path.is_dir():
        convert_directory(path, dry_run, exclude_dirs=args.exclude)
    else:
        print(f"错误: {path} 不是有效的文件或目录")
        sys.exit(1)
