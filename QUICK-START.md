---
title: 快速启动指南
description: Telegram VSCode 远程控制系统的快速启动指南。
tags: [telegram, vscode, quick-start]
---

# 快速启动指南

## 一行命令启动系统

双击运行: `simple-launch.bat`

## 完整启动流程（手动）

如果双击批处理文件不起作用，您可以按以下步骤手动操作：

### 1. 启动Bot服务器
```cmd
cd D:\项目文件\telegram-vscode-remote-control\bot-server
npm start
```

### 2. 配置Telegram Webhook
安装并运行ngrok:
```cmd
ngrok http 3000
```
然后使用生成的URL配置webhook:
```cmd
curl -F "url=https://<your-ngrok-url>.ngrok.io/webhook" https://api.telegram.org/bot8776467958:AAFMgUZHUkFJpRYilBNIMv-xT6Q3K1v4gpY/setWebhook
```

### 3. 安装VS Code扩展
在VS Code中:
- 按 `Ctrl+Shift+P`
- 运行 "Developer: Install Extension from Location..."
- 选择 `D:\项目文件\telegram-vscode-remote-control\vsc-extension\out`

### 4. 认证系统
在VS Code中:
- 按 `Ctrl+Shift+P`
- 运行 "Telegram Remote: Authenticate"

## 系统已准备就绪！

完成上述步骤后，您就可以通过Telegram机器人控制VS Code了。
