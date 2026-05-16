@echo off
REM 启动Telegram VSCode远程控制系统的批处理脚本

echo 正在启动Telegram VSCode远程控制系统...
echo.

REM 检查Node.js是否已安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js。请先安装Node.js。
    pause
    exit /b 1
)

REM 检查npm是否已安装
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到npm。请先安装npm。
    pause
    exit /b 1
)

echo 检测到Node.js和npm...
echo.

REM 进入bot-server目录并启动服务器
echo 正在启动Bot服务器...
cd bot-server

REM 检查是否已安装依赖
if not exist "node_modules" (
    echo 正在安装Bot服务器依赖...
    npm install
)

REM 编译TypeScript
echo 正在编译Bot服务器...
npm run build

REM 启动服务器
echo 启动Bot服务器...
start cmd /k "npm start"

REM 返回主目录
cd ..

echo.
echo Bot服务器已在后台启动。
echo 请确保已设置正确的环境变量（TELEGRAM_BOT_TOKEN等）
echo.

pause