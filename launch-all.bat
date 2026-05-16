@echo off
REM 一键启动Telegram VSCode远程控制系统

echo ================================================
echo     Telegram VSCode 远程控制系统一键启动
echo ================================================
echo.

echo 检查系统要求...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js。请先安装Node.js。
    pause
    exit /b 1
)

echo ✓ Node.js 环境正常

REM 检查并安装依赖
echo.
echo 正在检查并安装依赖...

REM 进入bot-server目录
cd /d "D:\项目文件\telegram-vscode-remote-control\bot-server"

if not exist "node_modules" (
    echo 安装Bot服务器依赖...
    npm install
    if %errorlevel% neq 0 (
        echo 错误: 安装Bot服务器依赖失败
        pause
        exit /b 1
    )
)

REM 检查是否有编译过的文件，如果没有则编译
if not exist "dist" (
    echo 构建Bot服务器...
    npx tsc
    if %errorlevel% neq 0 (
        echo 错误: 构建Bot服务器失败
        pause
        exit /b 1
    )
)

REM 启动Bot服务器
echo.
echo 正在启动Bot服务器...
start cmd /k "title Bot Server & cd /d \"D:\项目文件\telegram-vscode-remote-control\bot-server\" & npm start & pause"

REM 进入VS Code扩展目录
cd /d "D:\项目文件\telegram-vscode-remote-control\vsc-extension"

if not exist "node_modules" (
    echo 安装VS Code扩展依赖...
    npm install
    if %errorlevel% neq 0 (
        echo 错误: 安装VS Code扩展依赖失败
        pause
        exit /b 1
    )
)

REM 检查是否有编译过的文件，如果没有则编译
if not exist "out" (
    echo 构建VS Code扩展...
    npx tsc
    if %errorlevel% neq 0 (
        echo 错误: 构建VS Code扩展失败
        pause
        exit /b 1
    )
)

echo.
echo ================================================
echo            启动完成！
echo ================================================
echo.
echo 注意事项:
echo 1. Bot服务器已在后台启动，监听端口3000
echo 2. 您需要安装ngrok以获取公共URL：
echo    - 访问 https://ngrok.com 下载并安装
echo    - 运行: ngrok http 3000
echo 3. 使用ngrok提供的URL配置Telegram webhook:
echo    curl -F "url=^<NGROK_URL^>/webhook" ^
https://api.telegram.org/bot8776467958:AAFMgUZHUkFJpRYilBNIMv-xT6Q3K1v4gpY/setWebhook
echo 4. 在VS Code中安装扩展并认证:
echo    - 按Ctrl+Shift+P
echo    - 运行 "Developer: Install Extension from Location..."
echo    - 选择 D:\项目文件\telegram-vscode-remote-control\vsc-extension\out
echo    - 然后运行 "Telegram Remote: Authenticate"
echo.
echo 现在您可以开始使用Telegram机器人控制VS Code！
echo.
pause