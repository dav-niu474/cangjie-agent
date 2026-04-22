# 仓颉平台 - 知识蒸馏技能管理系统

<p align="center">
  <strong>Cangjie Platform — AI-Powered Knowledge Distillation & Skill Management</strong>
</p>

<p align="center">
  基于 NVIDIA AI 的知识蒸馏技能管理平台，集成代码审查、安全审计、提示工程和架构设计等专业技能。
</p>

---

## 项目简介

仓颉平台是一个面向开发者和团队的 **AI 知识蒸馏与技能管理系统**。平台将专业的工程知识（代码审查、安全审计、提示工程、架构设计）组织为结构化的技能包，通过 NVIDIA AI 大语言模型实现智能对话和知识蒸馏，帮助团队沉淀、分享和应用工程经验。

### 核心能力

- **智能对话**：内置多个专业 AI 助手（代码审查、安全审计、架构设计），支持多模型切换，提供上下文感知的智能对话
- **技能管理**：4 大技能包、18 项专业技能，涵盖代码审查、安全审计、提示工程、架构设计等核心领域
- **知识蒸馏**：选择技能组合，通过 AI 蒸馏生成综合分析报告，将碎片化知识整合为结构化洞察

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS 4 + shadcn/ui |
| 数据库 | PostgreSQL (Prisma ORM) |
| 部署 | Vercel (Serverless) |
| AI 引擎 | NVIDIA NIM (多模型) |
| 状态管理 | React Hooks + Server State |
| 通知 | Sonner |

### AI 模型支持

平台集成了 NVIDIA NIM 接口，支持以下模型：

| 模型 | 说明 |
|------|------|
| `meta/llama-3.1-8b-instruct` | Llama 3.1 8B — 快速响应，适合日常对话 |
| `meta/llama-3.1-70b-instruct` | Llama 3.1 70B — 高质量输出 |
| `mistralai/mixtral-8x22b-instruct-v0.1` | Mixtral 8x22B — MoE 架构 |
| `google/gemma-2-9b-it` | Gemma 2 9B — Google 开源 |
| `nvidia/nemotron-4-340b-instruct` | Nemotron 340B — 旗舰模型 |

## 功能模块

### 1. 智能对话

- 多 AI 助手切换（代码审查助手、安全审计专家、架构设计顾问、通用助手）
- 模型选择器，支持 5 种 NVIDIA 模型
- 会话历史管理（新建、查看、删除）
- 上下文连续对话（保留最近 20 条消息）
- 实时响应流式显示

### 2. 技能管理

- 4 大技能包分类浏览
- 18 项专业技能详细内容
- 技能搜索（名称、描述、标签）
- 技能详情面板（内容 + 参考资料）

### 3. 知识蒸馏

- 多技能勾选组合
- 自定义蒸馏提示词
- AI 综合分析报告生成
- 蒸馏历史记录

## 技能包一览

### 🔍 代码审查技能包 (5 项技能)

| 技能 | 描述 |
|------|------|
| 代码质量分析 | 圈复杂度、命名规范、重复度检测 |
| Bug 检测与诊断 | 空指针、越界、资源泄漏、并发问题 |
| 性能分析优化 | 算法复杂度、数据库优化、缓存策略 |
| 代码重构建议 | 代码异味识别、23 种重构手法 |
| 测试覆盖率审查 | 行/分支/路径覆盖率、TDD 实践 |

### 🛡️ 安全审计技能包 (5 项技能)

| 技能 | 描述 |
|------|------|
| 漏洞扫描检测 | OWASP Top 10、CWE 分类 |
| 认证授权审计 | OAuth 2.0、JWT、会话管理 |
| 数据安全保护 | 加密、脱敏、GDPR 合规 |
| API 安全加固 | 输入验证、速率限制、WAF |
| 依赖组件安全 | 供应链安全、许可证合规、SBOM |

### ✨ 提示工程技能包 (4 项技能)

| 技能 | 描述 |
|------|------|
| 提示词设计模式 | CLARITY 框架、模板结构 |
| 提示词优化策略 | 评估指标、迭代循环、A/B 测试 |
| 少样本学习能力 | Zero/Few-Shot Learning |
| 思维链推理 | Chain-of-Thought、Self-Consistency |

### 🏗️ 架构设计技能包 (4 项技能)

| 技能 | 描述 |
|------|------|
| 架构模式设计 | 单体、微服务、事件驱动、Serverless |
| 技术选型评估 | 评估矩阵、PoC 验证、决策流程 |
| 可扩展架构设计 | 水平扩展、缓存策略、高可用 |
| 分布式系统设计 | CAP 定理、一致性、服务治理 |

## 项目结构

```
cangjie-agent/
├── prisma/
│   └── schema.prisma          # 数据库模型定义
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 主页面 (SPA)
│   │   ├── globals.css         # 全局样式
│   │   └── api/
│   │       ├── seed/route.ts           # 数据库初始化/种子数据
│   │       ├── skills/route.ts         # 技能 CRUD API
│   │       ├── agents/route.ts         # Agent 管理 API
│   │       ├── conversations/route.ts  # 会话管理 API
│   │       ├── conversations/[id]/route.ts         # 单会话 API
│   │       ├── conversations/[id]/messages/route.ts # 消息 API
│   │       ├── chat/route.ts           # AI 对话 API
│   │       └── distill/route.ts        # 知识蒸馏 API
│   ├── components/
│   │   └── ui/                 # shadcn/ui 组件库
│   ├── lib/
│   │   ├── db.ts               # Prisma 数据库客户端
│   │   ├── data/skills.ts      # 技能数据定义
│   │   └── utils.ts            # 工具函数
│   └── hooks/                  # React Hooks
├── public/
├── .env.local                  # 环境变量
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── vercel.json
```

## 数据库模型

```
SkillPack (技能包)
  ├── Skill (技能) × N
  │     ├── name, description, content, references
  │     ├── tags, category
  │     └── order
  └── icon, description, order

Agent (AI 助手)
  ├── name, avatar, description
  ├── systemPrompt
  ├── model
  └── Conversation (会话) × N
        ├── title, model
        └── Message (消息) × N
              ├── role (user/assistant)
              └── content
```

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET/POST | `/api/seed` | 数据库初始化与种子数据 |
| GET | `/api/skills` | 获取所有技能包及技能 |
| GET/POST | `/api/agents` | 获取/创建 AI 助手 |
| GET/POST | `/api/conversations` | 获取/创建会话 |
| GET/DELETE | `/api/conversations/[id]` | 获取/删除会话 |
| GET | `/api/conversations/[id]/messages` | 获取会话消息 |
| POST | `/api/chat` | 发送消息（AI 对话） |
| POST | `/api/distill` | 知识蒸馏 |

## 本地开发

### 前置要求

- Node.js 18+ 或 Bun
- PostgreSQL 数据库
- NVIDIA API Key

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/dav-niu474/cangjie-agent.git
cd cangjie-agent

# 安装依赖
bun install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入数据库连接和 API Key

# 初始化数据库
bun run db:push

# 启动开发服务器
bun run dev
```

### 环境变量

| 变量 | 说明 | 必填 |
|------|------|------|
| `DATABASE_URL` | PostgreSQL 连接地址 | 是 |
| `NVIDIA_API_KEY` | NVIDIA NIM API 密钥 | 是 |

## 部署

项目已部署到 Vercel：

**🔗 [cangjie-agent.vercel.app](https://cangjie-agent.vercel.app)**

### Vercel 配置

1. 连接 GitHub 仓库
2. 配置环境变量：
   - `cangjie_POSTGRES_PRISMA_URL`
   - `cangjie_POSTGRES_URL_NON_POOLING`
   - `NVIDIA_API_KEY`
3. 添加 Vercel Postgres 数据库资源
4. 自动部署

## License

MIT

---

<p align="center">
  Built with ❤️ by Z.ai Code · Powered by <strong>NVIDIA AI</strong> & <strong>Next.js</strong>
</p>
