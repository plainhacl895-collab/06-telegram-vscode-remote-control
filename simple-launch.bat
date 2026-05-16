@echo off
REM 简化版Telegram VSCode远程控制系统启动脚本

echo 正在启动Telegram VSCode远程控制系统...

REM 检查Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js。请先安装Node.js。
    exit /b 1
)

REM 启动Bot服务器
echo 启动Bot服务器...
cd /d "D:\项目文件\telegram-vscode-remote-control\bot-server"
start "Bot Server" cmd /c "npm start & pause"

echo.
echo =============================
echo 系统已启动！接下来的步骤：
echo =============================
echo.
echo 1. 下载并运行ngrok (https://ngrok.com):
echo    ngrok http 3000
echo.
echo 2. 复制ngrok生成的HTTPS URL
echo.
echo 3. 打开浏览器，访问以下URL配置webhook:
echo    https://api.telegram.org/bot8776467958:AAFMgUZHUkFJpRYilBNIMv-xT6Q3K1v4gpY/setWebhook?url=^<YOUR_NGROK_URL^>/webhook
echo    (将^<YOUR_NGROK_URL^>替换为您的ngrok URL)
echo.
echo 4. 在VS Code中安装扩展:
echo    - 按Ctrl+Shift+P
echo    - 输入 "Developer: Install Extension from Location..."
echo    - 选择"D:\项目文件\telegram-vscode-remote-control\vsc-extension\out"
echo.
echo 5. 在VS Code中认证:
echo    - 按Ctrl+Shift+P
echo    - 运行 "Telegram Remote: Authenticate"
echo.
echo 完成这些步骤后，您就可以使用Telegram机器人控制VS Code了！
echo.
pause