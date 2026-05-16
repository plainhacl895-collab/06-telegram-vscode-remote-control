# 一键部署说明

## 文件说明

我们创建了三个部署脚本：

1. **`install-ngrok-to-d-drive.bat`** - 一键安装Scoop和ngrok到D盘
2. **`install-ngrok-to-d-drive.ps1`** - PowerShell版本的安装脚本
3. **`ultimate-deploy.bat`** - 终极一键部署脚本（推荐使用）

## 推荐使用方法

### 完整部署（推荐）
1. 双击运行 `ultimate-deploy.bat`
2. 脚本将自动：
   - 检查并安装ngrok（如果未安装）
   - 启动Bot服务器
   - 启动ngrok隧道
3. 按照屏幕上的说明完成配置

### 如果ngrok未自动安装
先运行 `install-ngrok-to-d-drive.bat` 或 `install-ngrok-to-d-drive.ps1`

## 部署后配置步骤

1. **获取ngrok URL**：从ngrok窗口复制HTTPS URL
2. **配置Webhook**：在浏览器访问
   `https://api.telegram.org/bot8776467958:AAFMgUZHUkFJpRYilBNIMv-xT6Q3K1v4gpY/setWebhook?url=<YOUR_NGROK_URL>/webhook`
3. **安装VS Code扩展**：在VS Code中安装 `vsc-extension\out` 目录的扩展
4. **认证系统**：在VS Code中运行 "Telegram Remote: Authenticate"

## 验证部署

完成上述步骤后，在Telegram中向您的机器人发送 `/start`，如果一切正常，您应该收到回复。

## 故障排除

- 如果ngrok命令未找到：重新启动命令提示符以刷新环境变量
- 如果Bot服务器无法启动：检查端口3000是否已被占用
- 如果机器人不回复：检查webhook配置是否正确