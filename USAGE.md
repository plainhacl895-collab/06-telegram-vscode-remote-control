---
title: Telegram VSCode Remote Control - 使用指南
description: 通过 Telegram 机器人远程控制 VS Code 任务执行的系统使用指南。
tags: [telegram, vscode, remote-control, usage]
---

# Telegram VSCode Remote Control

一个允许您通过Telegram机器人远程控制VS Code任务执行的系统。

## 项目结构

- `bot-server/`: Telegram机器人服务器，处理来自Telegram的消息并将其转发到VS Code
- `vsc-extension/`: VS Code扩展，执行来自机器人的命令
- `shared/`: 共享类型定义
- `docs/`: 文档文件

## 功能特性

- 通过Telegram远程执行VS Code中的代码
- 支持多种编程语言（JavaScript, Python, TypeScript, Go, Java等）
- 列出和执行VS Code任务
- 读取文件内容
- 安全的用户认证机制

## 安全特性

- JWT令牌认证机制
- 命令白名单验证
- 用户权限管理
- 输入验证和清理

## 如何使用

### 1. 设置Bot Server

1. 安装Node.js依赖：
   ```bash
   cd bot-server
   npm install
   ```

2. 创建环境变量文件：
   ```bash
   cp .env.example .env
   ```
   
   编辑`.env`文件，添加您的Telegram Bot Token和其他配置

3. 构建项目：
   ```bash
   npm run build
   ```

4. 启动Bot Server：
   ```bash
   npm start
   ```

### 2. 安装VS Code扩展

1. 安装Node.js依赖：
   ```bash
   cd vsc-extension
   npm install
   ```

2. 构建扩展：
   ```bash
   npm run compile
   ```

3. 安装扩展到VS Code：
   - 按 `Ctrl+Shift+P` 打开命令面板
   - 输入 "Developer: Install Extension from Location..."
   - 选择 `vsc-extension/out` 目录

### 3. 配置Telegram Webhook

将Telegram的webhook指向您部署的Bot Server：
```bash
curl -F "url=https://your-domain.com/webhook" https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook
```

### 4. 认证和使用

1. 在VS Code中按 `Ctrl+Shift+P` 打开命令面板
2. 输入 "Telegram Remote: Authenticate" 并执行
3. 将显示的认证码复制到Telegram机器人中
4. 认证成功后，即可通过Telegram机器人控制VS Code

## 可用命令

认证后可在Telegram中使用的命令:

- `/run <file>` - 运行指定文件
- `/list` - 列出可用任务
- `/file <path>` - 读取文件内容
- `/task <name>` - 执行VS Code任务

## 安全注意事项

- 妥善保管您的Telegram Bot Token
- 使用强密钥作为JWT_SECRET
- 定期更换认证码
- 监控系统日志
