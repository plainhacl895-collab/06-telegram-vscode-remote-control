# 配置Telegram Webhook指南

## 第一步：获取公共URL

由于Bot服务器在本地运行，我们需要一个公共URL以便Telegram API可以访问它。推荐使用ngrok：

1. 访问 https://ngrok.com 并注册账户
2. 下载并安装ngrok
3. 在命令行运行:
   ```
   ngrok http 3000
   ```
4. 记下生成的HTTPS URL（类似 https://abcd1234.ngrok.io）

## 第二步：配置Webhook

使用您刚刚获取的URL配置Telegram webhook:

```
curl -F "url=https://your-ngrok-url.ngrok.io/webhook" https://api.telegram.org/bot8776467958:AAFMgUZHUkFJpRYilBNIMv-xT6Q3K1v4gpY/setWebhook
```

或者使用浏览器访问：
```
https://api.telegram.org/bot8776467958:AAFMgUZHUkFJpRYilBNIMv-xT6Q3K1v4gpY/setWebhook?url=https://your-ngrok-url.ngrok.io/webhook
```

## 第三步：验证Webhook设置

验证webhook是否配置成功:
```
curl https://api.telegram.org/bot8776467958:AAFMgUZHUkFJpRYilBNIMv-xT6Q3K1v4gpY/getWebhookInfo
```

## 第四步：安装VS Code扩展并认证

1. 打开VS Code
2. 按 Ctrl+Shift+P 打开命令面板
3. 输入 "Developer: Install Extension from Location..."
4. 选择 `D:\项目文件\telegram-vscode-remote-control\vsc-extension\out` 目录
5. 重启VS Code
6. 按 Ctrl+Shift+P 运行 "Telegram Remote: Authenticate"

## 现在您可以开始使用！

认证完成后，您就可以通过Telegram机器人远程控制VS Code了。