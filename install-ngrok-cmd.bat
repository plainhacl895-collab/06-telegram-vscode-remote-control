@echo off
REM 安装Scoop和ngrok到D盘

echo ========================================
echo   Scoop和ngrok一键安装到D盘
echo ========================================

echo.
echo 1. 检查并创建D盘软件目录...
if not exist "D:\软件" mkdir "D:\软件"
if not exist "D:\软件\Scoop" mkdir "D:\软件\Scoop"

echo.
echo 2. 设置环境变量...
set SCOOP_ROOT=D:\软件\Scoop
set "PATH=%PATH%;%SCOOP_ROOT%\shims"

REM 设置Scoop环境变量
powershell -Command "[System.Environment]::SetEnvironmentVariable('SCOOP', '%SCOOP_ROOT%', 'User')"
powershell -Command "[System.Environment]::SetEnvironmentVariable('SCOOP_GLOBAL', '%SCOOP_ROOT%\global', 'User')"

echo.
echo 3. 检查PowerShell执行策略...
powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"

echo.
echo 4. 检查Scoop是否已安装...
scoop --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 安装Scoop...
    powershell -Command "Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression"
) else (
    echo Scoop已安装，跳过安装步骤
)

echo.
echo 5. 检查ngrok是否已安装...
ngrok version >nul 2>&1
if %errorlevel% neq 0 (
    echo 安装ngrok...
    powershell -Command "scoop install ngrok"
    if %errorlevel% neq 0 (
        echo 错误: ngrok安装失败
        pause
        exit /b 1
    )
) else (
    echo ngrok已安装，跳过安装步骤
)

echo.
echo ========================================
echo 安装完成！
echo ========================================
echo.
echo 现在您可以：
echo 1. 重启命令提示符以确保环境变量生效
echo 2. 运行: ngrok http 3000
echo.
echo 如果ngrok命令不可用，请将以下路径添加到系统PATH:
echo %SCOOP_ROOT%\shims
echo.
pause