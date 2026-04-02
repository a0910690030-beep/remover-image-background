# Image Background Remover - MVP 需求文档

## 1. 项目概述

**产品名称：** Image Background Remover (去除图片背景工具)

**核心功能：** 一键去除图片背景，支持 PNG 透明输出

**目标用户：** 设计师、电商卖家、自媒体创作者

---

## 2. 技术栈

| 层级 | 选型 |
|------|------|
| 前端托管 | Vercel |
| 前端框架 | React (或 Next.js) |
| 图片 API | Remove.bg |
| 图片处理 | 内存 (不存储) |

---

## 3. 功能需求

### 3.1 核心功能 (MVP)

| 需求 | 优先级 | 说明 |
|------|--------|------|
| 图片上传 | P0 | 支持拖拽或点击上传，支持 JPG/PNG |
| 去除背景 | P0 | 调用 Remove.bg API 处理 |
| 结果预览 | P0 | 显示处理前后对比 |
| 下载保存 | P0 | 下载透明背景 PNG |

### 3.2 边界处理

- 单文件大小限制：≤ 10MB
- 支持格式：JPG, PNG
- 并发限制：1 张 (防止 API 滥用)

---

## 4. 页面结构

```
首页
├── 上传区域 (拖拽/点击)
├── 处理按钮
├── 预览区 (原图 vs 去除背景后)
└── 下载按钮
```

---

## 5. API 接入

**Remove.bg API:**

```
Endpoint: https://api.remove.bg/v1/remove
Method: POST
Auth: API Key (Header)
Input: image_file (multi-part)
Output: image_file (PNG with alpha)
```

---

## 6. MVP 里程碑

1. ✅ 页面搭建 (React + Vercel)
2. ✅ Remove.bg API 接入
3. ✅ 上传 + 处理 + 下载完整流程
4. ✅ 部署上线

---

## 7. 后续可选 (v1.0 后)

- [ ] 批量处理
- [ ] 历史记录 (本地存储)
- [ ] 自建模型 (rembg)
- [ ] 会员体系

---

**创建时间：** 2026-04-02