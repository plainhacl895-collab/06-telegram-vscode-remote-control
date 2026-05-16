@echo off
REM 一键安装Scoop和ngrok到D盘脚本

echo ========================================
echo   Scoop和ngrok一键安装到D盘
echo ========================================

REM 检查PowerShell
powershell -Command "Get-Host" >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到PowerShell
    pause
    exit /b 1
)

echo.
echo 1. 创建D盘软件目录...
if not exist "D:\软件" mkdir "D:\软件"
if not exist "D:\软件\Scoop" mkdir "D:\软件\Scoop"

echo.
echo 2. 设置Scoop环境变量...
set SCOOP_ROOT=D:\软件\Scoop
set "PATH=%PATH%;%SCOOP_ROOT%\shims"

REM 使用PowerShell设置用户环境变量
powershell -Command "[System.Environment]::SetEnvironmentVariable('SCOOP', '%SCOOP_ROOT%', 'User')"
powershell -Command "[System.Environment]::SetEnvironmentVariable('SCOOP_GLOBAL', '%SCOOP_ROOT%\global', 'User')"

echo.
echo 3. 安装Scoop...
powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser"
powershell -Command "Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression"

echo.
echo 4. 安装ngrok...
scoop install ngrok

echo.
echo ========================================
echo 安装完成！
echo ========================================
echo.
echo 现在您可以：
echo 1. 重启命令提示符以使环境变量生效
echo 2. 运行: ngrok http 3000
echo.
echo 如果ngrok命令不可用，请将以下路径添加到系统PATH:
echo %SCOOP_ROOT%\shims
echo.
pause