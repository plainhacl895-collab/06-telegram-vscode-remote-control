---
title: Telegram VSCode 远程控制系统 - 完成设置指南
description: Telegram VSCode 远程控制系统完成设置的最终步骤指南。
tags: [telegram, vscode, setup, completion-guide]
---

# Telegram VSCode 远程控制系统 - 完成设置指南

## 状态检查

✅ ngrok 已成功安装到 D:\软件\Scoop\shims\ngrok.exe  
✅ Bot服务器代码已准备就绪  
✅ VS Code扩展代码已编译完成  

## 完成剩余步骤

### 步骤1：启动Bot服务器（已启动）
Bot服务器已在后台运行，监听端口3000。

### 步骤2：启动ngrok（需要手动完成）
在新的命令提示符窗口中运行：
```
ngrok http 3000
```

这将创建一个公共URL，如 `https://xxxx-xx-xxx-xxx-xxx.ngrok.io`

### 步骤3：配置Webhook（需要手动完成）
1. 从ngrok终端窗口复制HTTPS URL
2. 在浏览器中访问以下URL：
   ```
   https://api.telegram.org/bot8776467958:AAFMgUZHUkFJpRYilBNIMv-xT6Q3K1v4gpY/setWebhook?url=<YOUR_NGROK_URL>/webhook
   ```
   将 `<YOUR_NGROK_URL>` 替换为ngrok提供的实际URL。

### 步骤4：安装VS Code扩展（需要手动完成）
1. 打开VS Code
2. 按 `Ctrl+Shift+P`
3. 运行 "Developer: Install Extension from Location..."
4. 选择 `D:\项目文件\telegram-vscode-remote-control\vsc-extension\out`
5. 重启VS Code

### 步骤5：认证系统（需要手动完成）
1. 在VS Code中按 `Ctrl+Shift+P`
2. 运行 "Telegram Remote: Authenticate"
3. 复制显示的认证码

## 验证系统

完成上述步骤后，在Telegram中向机器人发送 `/start`，您应该收到回复。

## 故障排除

如果机器人不回复：
- 确认Bot服务器仍在运行（端口3000）
- 确认ngrok隧道仍在活动（ngrok进程运行中）
- 检查webhook配置是否成功
- 检查VS Code扩展是否已安装并认证

注意：由于系统安全限制，ngrok和Bot服务器需要在单独的终端窗口中运行。
