---
title: 安装配置指南
description: Telegram 机器人与 VS Code 集成环境的安装配置指南。
tags: [setup, installation, telegram, vscode]
---

# 安装配置指南

本指南将帮助您设置Telegram机器人与VS Code的集成环境。

## 前提条件

- Node.js 16+ 版本
- VS Code 最新版
- 有效的Telegram Bot Token
- 可访问互联网的环境

## 安装步骤

### 1. 克隆或创建项目

```bash
mkdir telegram-vscode-remote-control
cd telegram-vscode-remote-control
```

### 2. 设置Bot Server

#### 安装依赖

```bash
cd bot-server
npm install
```

#### 配置环境变量

创建 `.env` 文件:

```env
TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN_HERE
JWT_SECRET=your_secret_key_for_jwt_tokens
PORT=3000
```

#### 构建项目

```bash
npm run build
```

#### 启动Bot Server

```bash
npm start
```

### 3. 设置VS Code扩展

#### 安装依赖

```bash
cd ../vsc-extension
npm install
```

#### 构建扩展

```bash
npm run compile
```

#### 安装扩展

1. 按 `Ctrl+Shift+P` 打开命令面板
2. 输入 "Developer: Install Extension from Location..."
3. 选择 `vsc-extension/out` 目录

### 4. 配置Telegram Webhook

在启动Bot Server后，需要配置Telegram的webhook。您可以使用以下curl命令:

```bash
curl -F "url=https://your-domain.com/webhook" https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook
```

或者如果您使用本地隧道服务（如ngrok）进行测试:

```bash
curl -F "url=https://your-ngrok-url.ngrok.io/webhook" https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook
```

### 5. 使用方法

1. 在VS Code中按 `Ctrl+Shift+P` 打开命令面板
2. 输入 "Telegram Remote: Authenticate" 并执行
3. 将显示的认证码复制到Telegram机器人中
4. 认证成功后，即可通过Telegram机器人控制VS Code

### 6. 可用命令

认证后可在Telegram中使用的命令:

- `/run <file>` - 运行指定文件
- `/list` - 列出可用任务
- `/file <path>` - 读取文件内容
- `/task <name>` - 执行VS Code任务

## 故障排除

### Bot Server无法启动

- 检查端口是否被占用
- 确认环境变量设置正确
- 检查网络连接

### VS Code扩展无法激活

- 确认VS Code版本满足要求
- 检查依赖是否安装完整
- 查看开发者控制台错误信息

### Telegram无法收到回复

- 确认webhook设置正确
- 检查防火墙设置
- 确认服务器可从外部访问

## 安全注意事项

- 妥善保管您的Telegram Bot Token
- 使用强密钥作为JWT_SECRET
- 定期更换认证码
- 监控系统日志
