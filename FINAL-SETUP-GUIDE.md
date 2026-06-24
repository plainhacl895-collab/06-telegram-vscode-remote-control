---
title: Telegram VSCode 远程控制系统 - 完整部署指南
description: Telegram VSCode 远程控制系统完整部署指南，包含 ngrok、webhook 和 VS Code 扩展配置。
tags: [telegram, vscode, deployment, setup, guide]
---

# Telegram VSCode 远程控制系统 - 完整部署指南

## 状态摘要

恭喜！我们已经完成了以下步骤：

✅ **Bot服务器已创建并启动** - 在后台运行，监听端口3000  
✅ **项目文件已生成** - 包括服务器、VS Code扩展、文档等所有必要文件  
✅ **构建已完成** - TypeScript已编译为JavaScript  

## 当前部署状态

您的系统目前处于待激活状态：
- Bot服务器已在后台运行（端口3000）
- 代码文件全部准备就绪
- 现在只需要配置webhook和安装VS Code扩展

## 立即激活步骤

### 第1步：获取公共URL（必需）

由于您的计算机通常位于防火墙后面，需要一个公共URL来接收Telegram消息。使用ngrok：

1. 下载并安装ngrok: https://ngrok.com/download
2. 启动隧道服务：
   ```bash
   ngrok http 3000
   ```
3. 记下生成的URL（类似 `https://abc123.ngrok.io`）

### 第2步：配置Webhook（必需）

使用您获取的公共URL配置Telegram webhook：

```bash
curl -F "url=https://your-ngrok-url.ngrok.io/webhook" https://api.telegram.org/bot8776467958:AAFMgUZHUkFJpRYilBNIMv-xT6Q3K1v4gpY/setWebhook
```

或者在浏览器中访问：
```
https://api.telegram.org/bot8776467958:AAFMgUZHUkFJpRYilBNIMv-xT6Q3K1v4gpY/setWebhook?url=https://your-ngrok-url.ngrok.io/webhook
```

### 第3步：安装VS Code扩展（必需）

1. 打开VS Code
2. 按 `Ctrl+Shift+P` → "Developer: Install Extension from Location..."
3. 选择 `D:\项目文件\telegram-vscode-remote-control\vsc-extension\out` 目录
4. 重启VS Code

### 第4步：进行认证（必需）

1. 在VS Code中按 `Ctrl+Shift+P`
2. 运行 "Telegram Remote: Authenticate"
3. 复制显示的认证码

## 开始使用

完成以上步骤后，您就可以：

1. 在Telegram中向机器人发送 `/start`
2. 按照提示使用认证码完成认证
3. 使用以下命令控制VS Code：
   - `/run <filename>` - 运行代码文件
   - `/list` - 列出可用任务
   - `/file <path>` - 读取文件内容
   - `/task <name>` - 执行VS Code任务

## 测试连接

当您向机器人发送 `/start` 命令时，如果一切配置正确，您应该收到欢迎消息。

## 故障排除

如果机器人不回复：
- 确认Bot服务器仍在运行（如果没有，请重启）
- 确认ngrok隧道仍在活动状态（如果没有，请重启）
- 确认webhook配置正确
- 检查VS Code扩展是否已安装

---

**重要提醒**: 您的Telegram Bot Token (8776467958:AAFMgUZHUkFJpRYilBNIMv-xT6Q3K1v4gpY) 已预配置在系统中。请确保妥善保管，不要在公开场合分享此Token。

现在只需完成上述配置步骤，您就可以开始使用Telegram机器人远程控制VS Code了！
