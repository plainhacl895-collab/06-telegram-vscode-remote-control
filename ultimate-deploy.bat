@echo off
REM 终极一键部署脚本：Telegram VSCode远程控制系统 + ngrok

echo =====================================================
echo        Telegram VSCode 远程控制系统一键部署
echo =====================================================
echo.

REM 设置环境变量
set PROJECT_DIR=D:\项目文件\telegram-vscode-remote-control
set SOFTWARE_DIR=D:\软件
set SCOOP_DIR=D:\软件\Scoop

echo 1. 检查并创建必要目录...
if not exist "%SOFTWARE_DIR%" mkdir "%SOFTWARE_DIR%"
if not exist "%PROJECT_DIR%" (
    echo 错误: 项目目录不存在，请先创建Telegram VSCode远程控制系统
    pause
    exit /b 1
)

echo.
echo 2. 设置环境变量...
set "PATH=%PATH%;%SCOOP_DIR%\shims"

echo.
echo 3. 检查ngrok是否已安装...
ngrok version >nul 2>&1
if %errorlevel% neq 0 (
    echo ngrok未安装，开始安装到D盘...

    REM 设置Scoop环境变量
    set SCOOP_ROOT=%SCOOP_DIR%
    powershell -Command "[System.Environment]::SetEnvironmentVariable('SCOOP', '%SCOOP_ROOT%', 'User')"

    REM 安装Scoop和ngrok
    echo 安装Scoop和ngrok...
    powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"
    powershell -Command "if (!(Get-Command scoop -ErrorAction SilentlyContinue)) { Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression }"
    powershell -Command "scoop install ngrok"

    echo 验证ngrok安装...
    ngrok version
    if %errorlevel% neq 0 (
        echo 错误: ngrok安装失败
        pause
        exit /b 1
    )
    echo ✓ ngrok安装成功
) else (
    echo ✓ ngrok已安装
    ngrok version
)

echo.
echo 4. 启动Bot服务器...
cd /d "%PROJECT_DIR%\bot-server"
start "Bot Server" cmd /c "title Telegram Bot Server & npm start & echo.`nBot服务器已停止，请重新运行此脚本启动 & pause"

echo.
echo 5. 准备启动ngrok...
echo 请注意：现在启动ngrok将创建一个公共URL用于Telegram webhook
echo.
choice /C YN /M "是否现在启动ngrok?"
if errorlevel 2 goto skip_ngrok
if errorlevel 1 goto start_ngrok

:start_ngrok
echo.
echo 启动ngrok以创建公共URL...
start "Ngrok" cmd /c "title Ngrok Tunnel & ngrok http 3000 & pause"

echo.
echo =====================================================
echo           启动完成！
echo =====================================================
echo.
echo 现在请执行以下步骤：
echo.
echo 1. 在ngrok窗口中复制生成的HTTPS URL
echo    (格式类似: https://abc123.ngrok.io)
echo.
echo 2. 打开浏览器，访问以下URL配置webhook:
echo    https://api.telegram.org/bot8776467958:AAFMgUZHUkFJpRYilBNIMv-xT6Q3K1v4gpY/setWebhook?url=^<YOUR_NGROK_URL^>/webhook
echo    (将^<YOUR_NGROK_URL^>替换为您从ngrok窗口复制的URL)
echo.
echo 3. 在VS Code中安装扩展:
echo    - 按Ctrl+Shift+P
echo    - 输入 "Developer: Install Extension from Location..."
echo    - 选择 "%PROJECT_DIR%\vsc-extension\out"
echo.
echo 4. 在VS Code中认证:
echo    - 按Ctrl+Shift+P
echo    - 运行 "Telegram Remote: Authenticate"
echo.
echo 完成这些步骤后，您就可以通过Telegram机器人控制VS Code了！
goto end

:skip_ngrok
echo.
echo 您选择跳过ngrok启动。
echo 请稍后手动启动ngrok: ngrok http 3000
echo.

:end
pause