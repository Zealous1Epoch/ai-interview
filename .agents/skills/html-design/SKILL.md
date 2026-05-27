---
name: html-design
description: 可视化设计配置器。通过浏览器界面选择设计参数（颜色、字体、动效等），实时生成设计规范 prompt 并注入 Claude Code 对话。用于在生成 HTML 页面前统一设计风格。
---

# HTML Design Skill

可视化设计配置器。通过浏览器界面选择设计参数（颜色、字体、动效等），实时生成设计规范 prompt 并注入 Claude Code 对话。

## 安装

```bash
# 方式 1：通过 npx skills CLI（推荐）
npx skills add Zealous1Epoch/html-design-skill

# 方式 2：手动 git clone
git clone https://github.com/Zealous1Epoch/html-design-skill.git \
  ~/.claude/skills/html-design
```

**前置要求**: Node.js >= 18

首次运行时自动安装 npm 依赖。

**在线 Demo**: [zealous1epoch.github.io/html-design-skill](https://zealous1epoch.github.io/html-design-skill)

## 用法

在任意 Claude Code 会话中输入：

```
/html-design
```

## 工作流程

1. 检测 Node.js 版本
2. 首次运行自动 `npm install`
3. 寻找空闲端口并启动 Vite 开发服务器
4. 打开浏览器配置页面
5. 用户在浏览器中完成设计选择 — 步骤 1/2 选参数，步骤 2/2 预览
6. 点击「完成并返回」，提示词自动回传对话
7. AI 按照设计规范生成 HTML

## 文件结构

```
.claude/skills/html-design/
├── SKILL.md       # 本文件（技能定义，必须大写）
├── run.sh         # 入口脚本（Claude Code 自动执行）
└── web/           # React 配置应用
```
