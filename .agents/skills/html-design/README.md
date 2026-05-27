# HTML Design Skill

一个 Claude Code 技能，通过浏览器界面可视化选择设计参数（颜色、字体、动效、组件样式等），自动生成设计规范 Prompt 并注入对话，让 AI 生成风格统一的 HTML 页面。

## 快速开始

### 前置要求

- Node.js >= 18
- Claude Code CLI

### 安装

方式 1：通过 npx skills CLI（推荐）
```bash
npx skills add Zealous1Epoch/html-design-skill
```

方式 2：手动 git clone
```bash
git clone https://github.com/Zealous1Epoch/html-design-skill.git \
  ~/.claude/skills/html-design
```

**在线 Demo**：[zealous1epoch.github.io/html-design-skill](https://zealous1epoch.github.io/html-design-skill)

### 使用

在任意 Claude Code 会话中输入：

```
/html-design
```

自动启动浏览器配置页面（默认端口 5199，自动寻找空闲端口）。在浏览器中完成设计选择后，点击「完成并返回」，设计规范 Prompt 自动回传对话。

## 功能特性

### 23 个设计维度

| 分类 | 数量 | 维度 |
|------|------|------|
| 基础视觉 | 9 | 背景色、主色调、文字色、强调色、字体系统、深色模式、圆角系统、阴影层级、间距系统 |
| 组件样式 | 7 | 按钮样式、卡片风格、输入框、导航栏、图标风格、表格样式、徽章标签 |
| 动效交互 | 7 | 悬停效果、点击反馈、页面转场、加载动画、完成动画、滚动揭示、微交互 |

### 设计亮点

- **配色原子化**：每种颜色独立选择，支持取色器，不局限于预设色板
- **滑块维度**：圆角、阴影、间距使用滑块调节，配合实时 Bench 预览
- **视觉选项卡**：每个选项都有真实渲染的 Demo——按钮、动画效果、字体样本等
- **两阶段流程**：先选参数，再预览完整效果

### 交互模式

```
步骤 1：浏览选择
  → 左侧面板：按 3 个分类浏览 23 个维度
  → 中间区域：可视化选项卡（含实时 Demo）或滑块调节面板
  → 右侧面板：Prompt 实时累加

步骤 2：生成预览
  → 所有选择应用到 3 种 Demo 页面（营销页、仪表盘、博客）
  → 可复制 Prompt 或一键回传 Claude Code
```

## 文件结构

```
html-design-skill/
├── README.md
├── SKILL.md              # Claude Code 技能定义
├── run.sh                # 入口脚本（自动安装依赖、寻找端口）
└── web/                  # React + Vite + TypeScript 应用
    ├── src/
    │   ├── components/   # LeftPanel, CenterCanvas, RightPanel 等 13 个组件
    │   ├── store/        # Zustand 状态管理
    │   ├── data/         # 23 个维度定义 + Prompt 模板
    │   └── utils/        # Prompt 构建器
    ├── vite.config.ts    # 含 save-result API 中间件
    └── package.json
```

## 工作流程

1. `/html-design` 触发 `run.sh`
2. 脚本检测 Node.js 版本，首次运行自动安装 npm 依赖
3. 寻找空闲端口并启动 Vite 开发服务器
4. 打开浏览器配置页面
5. 用户在浏览器中完成设计选择，Prompt 实时累加
6. 点击「完成并返回」，结果写入 `~/.html-design/result.txt`
7. `run.sh` 读取文件并注入 Claude Code 对话
8. AI 按照设计规范生成 HTML

## 设计语言

本工具自身的 UI 采用温暖编辑风格：

- 象牙白底色 `#FAF9F5`
- 陶土色强调 `#D97757`
- 衬线标题（Noto Serif SC）+ 无衬线正文 + 等宽标签
- 统一 1.5px 边框
- 摒弃通用 SaaS 科技蓝风格

## 贡献

添加新的设计维度：

1. 在 `web/src/data/dimensions.ts` 中添加维度定义
2. 在 `web/src/components/OptionCard.tsx` 中添加视觉 Demo
3. 如果是滑块类型，设置 `controlType: 'slider'` 并提供 `sliderConfig`

欢迎提交 PR。

## License

MIT
