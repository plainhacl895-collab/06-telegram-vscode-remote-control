@echo off
REM 一键部署Telegram VSCode远程控制系统

echo ===============================================
echo    Telegram VSCode 远程控制系统一键部署
echo ===============================================
echo.

REM 检查Node.js
echo 1. 检查Node.js环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js。请先安装Node.js。
    pause
    exit /b 1
)
echo ✓ Node.js 环境正常
echo.

REM 检查npm
echo 2. 检查npm环境...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到npm。请先安装npm。
    pause
    exit /b 1
)
echo ✓ npm 环境正常
echo.

REM 安装Bot Server依赖并构建
echo 3. 安装并构建Bot服务器...
cd bot-server
if exist "node_modules" (
    echo 跳过依赖安装（已存在）
) else (
    echo 安装Bot服务器依赖...
    npm install
)
echo 构建Bot服务器...
npx tsc
if %errorlevel% neq 0 (
    echo 错误: Bot服务器构建失败
    cd ..
    pause
    exit /b 1
)
cd ..

REM 安装VS Code扩展依赖并构建
echo.
echo 4. 安装并构建VS Code扩展...
cd vsc-extension
if exist "node_modules" (
    echo 跳过依赖安装（已存在）
) else (
    echo 安装VS Code扩展依赖...
    npm install
)
echo 构建VS Code扩展...
npx tsc
if %errorlevel% neq 0 (
    echo 错误: VS Code扩展构建失败
    cd ..
    pause
    exit /b 1
)
cd ..

REM 提示用户下一步操作
echo.
echo ===============================================
echo    构建完成！接下来的配置步骤：
echo ===============================================
echo.
echo 1. VS Code扩展安装:
echo    - 打开VS Code
echo    - 按 Ctrl+Shift+P
echo    - 输入 "Developer: Install Extension from Location..."
echo    - 选择当前目录下的 vsc-extension\out 文件夹
echo.
echo 2. 环境变量配置:
echo    - 复制 bot-server\.env.example 为 .env
echo    - 确保 TELEGRAM_BOT_TOKEN 已经预设
echo.
echo 3. 启动Bot服务器:
echo    - 进入 bot-server 目录
echo    - 运行: npm start
echo.
echo 4. 配置Telegram Webhook (仅首次):
echo    - 如果使用本地环境，需要ngrok等工具
echo    - 配置webhook指向您的服务器地址
echo.
echo 5. 认证使用:
echo    - 在VS Code中: Ctrl+Shift+P -> "Telegram Remote: Authenticate"
echo    - 在Telegram中使用显示的认证码
echo.
pause