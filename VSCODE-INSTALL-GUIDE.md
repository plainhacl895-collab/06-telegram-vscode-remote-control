---
title: VS Code 扩展安装指南
description: Telegram VSCode 远程控制系统的 VS Code 扩展安装指南。
tags: [vscode, extension, installation]
---

# VS Code扩展安装指南

## 安装VS Code扩展

要使系统完全运行，您需要安装VS Code扩展。请按以下步骤操作：

### 方法一：手动安装（推荐）

1. 打开VS Code应用程序
2. 按 `Ctrl+Shift+P` 打开命令面板
3. 输入 "Developer: Install Extension from Location..." 并选择
4. 在文件浏览器中导航到以下位置并选择 `out` 文件夹：
   ```
   D:\项目文件\telegram-vscode-remote-control\vsc-extension\out
   ```
5. VS Code将提示扩展已准备好安装，点击"重新加载"按钮完成安装

### 方法二：打包安装

1. 在VS Code中安装vsce工具：
   ```bash
   npm install -g vsce
   ```
2. 导航到扩展目录并打包：
   ```bash
   cd D:\项目文件\telegram-vscode-remote-control\vsc-extension
   vsce package
   ```
3. 这将创建一个.vsix文件，可以在VS Code中通过"安装从VSIX"进行安装

## 认证机器人与VS Code

安装完成后，需要将Telegram机器人与VS Code关联：

1. 打开VS Code
2. 按 `Ctrl+Shift+P` 打开命令面板
3. 输入并运行 "Telegram Remote: Authenticate"
4. 将显示的认证码复制到Telegram聊天中
5. 在Telegram中发送认证码给机器人

## 测试连接

认证完成后，您可以在Telegram中测试基本命令：

- 发送 `/start` - 应该收到欢迎消息
- 发送 `/help` - 应该收到帮助信息
- 发送 `/auth` - 应该显示认证状态

## 验证系统状态

当所有组件正确配置后，系统工作流程如下：

1. 您在Telegram中发送消息
2. Telegram API将消息发送到您的Bot服务器
3. Bot服务器处理消息并可能向VS Code扩展发送请求
4. VS Code扩展执行相应操作
5. 结果返回到Bot服务器
6. Bot服务器将结果发送回您的Telegram

## 故障排除

如果机器人不回复：
1. 检查Bot服务器是否正在运行
2. 检查webhook是否配置正确
3. 检查VS Code扩展是否已安装并认证
4. 检查网络连接和防火墙设置

注意：在本地运行时，您需要一个公共可访问的URL（例如通过ngrok）以便Telegram API可以到达您的服务器。
