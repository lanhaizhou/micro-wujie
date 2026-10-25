# Wujie (无界) 企业级微前端后台管理系统 + Hono 远程多语言体系

本项目基于腾讯开源的 **Wujie（无界）** 微前端框架构建，采用 **Vue 3 最新版 + Vite 最新版 + Tailwind CSS 4 最新版 + TypeScript 最新版**。

项目由 **4 个完全独立的服务/工程** 以及 **1 个封装好的多语言公共 SDK (`i18n-sdk`)** 构成（非 monorepo，各自独立）：
- **`server`** (Hono 后端服务)：端口 `http://localhost:3000`（纯 JSON 语言包分发，版本号下发，开启 CORS）
- **`i18n-sdk`** (多语言通用 SDK)：封装 `idb-keyval` 离线缓存、版本比对、Hono API 请求、无界自动广播与双向联动监听
- **`main-app`** (主基座)：端口 `http://localhost:5100`（支持顶部中/英切换，全域广播，内存直传子应用）
- **`ops-app`** (运营中心子系统)：端口 `http://localhost:5101`（引入 SDK，子应用 0 网络请求）
- **`finance-app`** (财务中心子系统)：端口 `http://localhost:5102`（引入 SDK，子应用 0 网络请求）

---

## 🌟 技术栈版本

| 依赖 / 工具 | 版本 | 说明 |
| :--- | :--- | :--- |
| **Vue** | `^3.5.44` | Vue 3 核心与组合式 API (Composition API) |
| **vue-i18n** | `^11.4.16` | Vue 官方主流国际化框架，Composition API 模式，提供官方 `$t`、`v-t`、`useI18n` |
| **Vite** | `^8.3.5` | 极速前端构建与开发服务 |
| **Tailwind CSS** | `^4.3.3` | Tailwind CSS v4 最新架构，集成 `@tailwindcss/vite` |
| **TypeScript** | `~6.0.3` / `^5.7.0` | 严格模式与类型安全检查 |
| **Wujie (无界)** | `^2.1.0` | 基于 WebComponent + Iframe 沙箱的微前端框架 (`wujie-vue3`) |
| **Hono** | `^4.7.1` | 现代极速轻量后端框架，提供多语言 JSON 接口、版本号控制与 CORS 跨域 |
| **idb-keyval** | `^6.2.1` | Google Chrome 团队出品的极简 IndexedDB 异步键值对缓存库 |
| **Vue Router** | `^5.4.0` | 路由体系（基座采用 History 模式，子系统采用 Hash 模式适配微前端同步） |
| **Lucide Vue** | `^1.0.0` | 现代化轻量图标库 (`@lucide/vue`) |

---

## 📁 目录结构

```text
micro/
├── start-all.sh             # 一键启动 4 个服务集群的便捷脚本
├── README.md                # 架构设计与接入说明文档
│
├── server/                  # 【Hono 后端多语言服务】(Port: 3000)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts         # Hono 路由与版本号控制中间件
│       └── locales/         # 纯服务端维护的语言包 JSON
│           ├── zh-CN.json   # 简体中文全量词条 (含 version: "1.0.1")
│           └── en-US.json   # 英语全量词条 (含 version: "1.0.0")
│
├── i18n-sdk/                # 【独立封装的多语言 SDK】
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── cache.ts         # 基于 idb-keyval 读写 IndexedDB (数据库: micro_i18n_db)
│       ├── api.ts           # 请求 Hono 接口拉取最新 JSON 语言包
│       ├── core.ts          # 辅助工具函数
│       └── index.ts         # Vue 3 插件，集成官方 vue-i18n + IndexedDB 缓存比对 + Wujie 沙箱直传 (子应用 0 网络请求)
│
├── main-app/                # 【主基座应用】(Port: 5100)
│   ├── src/
│   │   ├── main.ts          # 初始化 WujieVue 与 i18n-sdk
│   │   ├── App.vue          # 后台管理 Layout (顶部中/英语言切换器、全局广播)
│   │   └── views/           # Dashboard 及 OpsContainer / FinanceContainer 挂载容器
│
├── ops-app/                 # 【运营中心子应用】(Port: 5101)
│   └── src/
│       ├── main.ts          # 接入 i18n-sdk (app.use(createMicroI18n(...)))
│       └── views/           # 看板页面，文案使用 t('ops.title') 响应式多语言
│
└── finance-app/             # 【财务中心子应用】(Port: 5102)
    └── src/
        ├── main.ts          # 接入 i18n-sdk
        └── views/           # 财务大盘，文案使用 t('finance.title') 响应式多语言
```

---

## 🚀 快速启动

在根目录下执行：
```bash
./start-all.sh
```
执行后将并发启动 4 个服务的开发环境：
- 🚀 **Hono 服务端**：[http://localhost:3000](http://localhost:3000)
- 🌐 **主基座后台**：[http://localhost:5100](http://localhost:5100)
- 📊 **运营中心 (独立访问)**：[http://localhost:5101](http://localhost:5101)
- 💰 **财务中心 (独立访问)**：[http://localhost:5102](http://localhost:5102)

---

## 🌍 版本控制与双重极致缓存策略

### 1. 后端版本号控制（Version Control）
* 服务端接口 `/api/i18n/languages` 仅返回百余字节的元信息：
  ```json
  [
    { "code": "zh-CN", "name": "简体中文", "version": "1.0.1" },
    { "code": "en-US", "name": "English", "version": "1.0.0" }
  ]
  ```
* **版本一致 $\rightarrow$ 严格走缓存**：
  若本地 IndexedDB 缓存的 `version` 与远程 `version` 完全一致，**绝不请求任何 `/api/i18n/pack` 大文件接口**，直接使用本地缓存！
* **版本变更 $\rightarrow$ 自动失效并重拉**：
  若后端修改词条并发布了新版本（例如 `1.0.1` $\rightarrow$ `1.0.2`），SDK 检测到版本不一致，自动触发重新拉取并覆写 IndexedDB。

### 2. 子应用 0 网络请求（Zero-Request）
* 在微前端嵌合模式下，主基座已经拥有完整的当前语言包对象。
* 主基座通过 `<WujieVue :props="{ lang, langPack: currentPack }">` 将语言包以**内存对象**形式直传给子应用。
* 子应用初始化或切换时，直接使用 `props.langPack`，**不请求 `/languages`，不请求 `/pack`，0 次网络请求，0 毫秒渲染延迟**！
* 仅当子应用作为独立工程（Standalone，直接访问 5101 端口）打开时，才走独立的 IndexedDB / Hono 服务。
