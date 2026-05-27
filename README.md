# AI 面试模拟

面向在校生和应届生的免费 AI 面试练习工具。上传简历、选择岗位方向，AI 面试官带你完成一场全真模拟面试，并生成多维度评估报告和针对性练习建议。

## 核心功能

### 全真模拟面试
5 阶段完整面试流程：**自我介绍 → 项目深挖 → 技术问答 → 行为问题 → 反问环节**。AI 自动判断阶段过渡，模拟真实面试节奏和追问深度。

### 简历驱动提问
AI 面试官根据你提供的简历内容提问，项目经历、技术栈、实习经验都会被纳入考察范围，不再是泛泛而谈。

### 流式对话体验
AI 回复逐字实时渲染，对话体验自然流畅，像在跟真人面试官聊天。

### 多维度评估报告
面试结束后自动生成评估报告，包含 4 个评分维度（技术能力、沟通表达、逻辑思维、项目经验）、综合评价、优势总结和待改进项。

### 专项练习
从评估报告的弱项一键进入针对性练习，支持 6 种练习类型：计算机网络、操作系统、数据库、编程语言、行为问题、项目深挖。每道题有 AI 点评和参考答案。

### 数据安全保障
- 无需注册登录，打开即用
- 面试记录和报告存储在浏览器 IndexedDB，不上传服务器
- API Key 仅保存在服务端，前端不可见
- 支持刷新恢复面试状态

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| UI | React 18 + Tailwind CSS |
| 语言 | TypeScript |
| 状态管理 | Zustand |
| 本地存储 | IndexedDB (idb) + sessionStorage |
| AI 接口 | DeepSeek API (流式输出) |
| 测试 | Vitest + Testing Library |
| 部署 | Vercel |

## 项目结构

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # 面试对话 API（流式）
│   │   └── parse-file/route.ts    # 文件解析 API
│   ├── setup/page.tsx             # 面试设置页
│   ├── interview/page.tsx         # 面试进行页
│   ├── report/[id]/page.tsx       # 评估报告页
│   ├── history/page.tsx           # 历史记录页
│   ├── layout.tsx                 # 根布局
│   └── page.tsx                   # 首页
├── components/
│   ├── ChatInput.tsx              # 聊天输入框
│   ├── ChatMessage.tsx            # 对话消息气泡
│   ├── InterviewHeader.tsx        # 面试顶部状态栏
│   ├── StageIndicator.tsx         # 阶段指示器
│   ├── ScoreBar.tsx               # 评分进度条
│   ├── ReportCard.tsx             # 报告卡片
│   ├── HistoryCard.tsx            # 历史记录卡片
│   ├── PracticePanel.tsx          # 专项练习面板
│   ├── InactivityPrompt.tsx       # 长时间未响应提示
│   └── ErrorBoundary.tsx          # 错误边界
├── lib/
│   ├── types.ts                   # 类型定义
│   ├── prompts.ts                 # System Prompt 构建
│   ├── db.ts                      # IndexedDB 操作
│   └── utils.ts                   # 工具函数
├── store/
│   ├── interview.ts               # 面试状态 (Zustand)
│   └── practice.ts                # 练习状态 (Zustand)
└── hooks/
    └── useSpeechRecognition.ts    # 语音识别 Hook（预留）
```

## 快速开始

### 环境要求

- Node.js >= 18
- DeepSeek API Key（[获取地址](https://platform.deepseek.com)）

### 本地运行

```bash
# 1. 克隆项目
git clone https://github.com/Zealous1Epoch/ai-interview.git
cd ai-interview

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local，填入你的 DeepSeek API Key

# 4. 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可使用。

### 环境变量

| 变量 | 说明 | 必填 |
|------|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | 是 |
| `DEEPSEEK_BASE_URL` | API 地址（默认 `https://api.deepseek.com`） | 否 |

### 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Zealous1Epoch/ai-interview)

点击上方按钮一键部署，然后在 Vercel 项目设置中添加环境变量 `DEEPSEEK_API_KEY`。

## 使用指南

### 1. 开始面试
首页点击「开始面试」→ 填写目标岗位 → 粘贴简历内容 → 选择面试方向（技术/通用/综合）。

### 2. 面试流程
AI 会按阶段引导面试，你只需要像真实面试一样回答问题。右上角显示当前阶段和面试时长。如果超过 5 分钟未操作，系统会弹出提醒。

### 3. 查看报告
面试结束后自动跳转评估报告页，查看各维度评分和改进建议。

### 4. 专项练习
点击报告中的「专项练习」按钮，选择题目数量，针对弱项进行强化训练。

### 5. 历史回顾
首页「查看历史记录」可浏览所有过往面试和报告。

## 运行测试

```bash
npm test           # 运行所有测试
npm run test:watch # 监听模式
```

## License

MIT
