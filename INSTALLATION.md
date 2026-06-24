---
title: 安装和部署指南
description: Telegram VSCode 远程控制系统的安装和部署指南。
tags: [telegram, vscode, installation, deployment]
---

# 安装和部署指南

本文档详细说明如何安装和部署Telegram VSCode远程控制系统。

## 系统要求

- Node.js 16.x 或更高版本
- VS Code 1.74 或更高版本
- 有效的Telegram Bot Token
- 稳定的互联网连接

## 安装步骤

### 1. 克隆项目

```bash
git clone <repository-url>
cd telegram-vscode-remote-control
```

### 2. 安装Bot服务器依赖

```bash
cd bot-server
npm install
npm run build
```

### 3. 配置环境变量

在 `bot-server` 目录下创建 `.env` 文件：

```env
TELEGRAM_BOT_TOKEN=8776467958:AAFMgUZHUkFJpRYilBNIMv-xT6Q3K1v4gpY
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
PORT=3000
```

### 4. 安装VS Code扩展依赖

```bash
cd ../vsc-extension
npm install
npm run compile
```

### 5. 安装VS Code扩展

1. 打开VS Code
2. 按 `Ctrl+Shift+P` 打开命令面板
3. 输入 "Developer: Install Extension from Location..."
4. 选择 `vsc-extension/out` 目录

### 6. 部署Bot服务器

您有几个选项来部署Bot服务器：

#### 选项A: 本地运行（用于测试）

```bash
cd ../bot-server
npm start
```

然后使用像 [ngrok](https://ngrok.com/) 这样的服务来创建公共URL：

```bash
ngrok http 3000
```

#### 选项B: 部署到云平台

您可以将Bot服务器部署到各种云平台，如：
- Heroku
- Vercel
- AWS
- Google Cloud
- Azure

## 配置Telegram Webhook

一旦服务器部署完成并获得公共URL，您需要配置Telegram webhook：

```bash
curl -F "url=https://your-deployed-url/webhook" \
     https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook
```

## 测试连接

1. 启动Bot服务器
2. 在VS Code中运行认证命令（Ctrl+Shift+P -> "Telegram Remote: Authenticate"）
3. 在Telegram中向机器人发送 `/start` 命令
4. 验证是否收到回复

## 常见问题

### 服务器无法启动

- 检查端口是否被占用
- 验证环境变量是否正确设置
- 查看控制台错误信息

### Telegram无响应

- 检查webhook配置是否正确
- 确认服务器可以从互联网访问
- 检查防火墙设置

### 认证失败

- 确认VS Code扩展已正确安装
- 验证认证码是否正确输入
- 检查JWT密钥配置

## 安全建议

- 定期更换JWT密钥
- 限制可以访问服务器的IP地址
- 监控服务器日志
- 不要在生产环境中暴露敏感信息
