# PowerShell脚本：一键安装Scoop和ngrok到D盘

Write-Host "========================================" -ForegroundColor Green
Write-Host "   Scoop和ngrok一键安装到D盘" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# 检查D盘是否存在
if (!(Test-Path "D:\")) {
    Write-Host "错误: 未找到D盘" -ForegroundColor Red
    Pause
    exit 1
}

Write-Host "`n1. 创建D盘软件目录..."
$softwareDir = "D:\软件"
$scoopDir = "D:\软件\Scoop"
New-Item -ItemType Directory -Path $softwareDir -Force
New-Item -ItemType Directory -Path $scoopDir -Force

Write-Host "`n2. 设置Scoop环境变量..."
$env:SCOOP = $scoopDir
[Environment]::SetEnvironmentVariable("SCOOP", $scoopDir, "User")
[Environment]::SetEnvironmentVariable("SCOOP_GLOBAL", "$scoopDir\global", "User")

# 将Scoop的shims添加到当前会话的PATH
$shimsPath = "$scoopDir\shims"
$env:PATH = "$env:PATH;$shimsPath"

Write-Host "`n3. 配置PowerShell执行策略..."
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

Write-Host "`n4. 安装Scoop..."
# 检查Scoop是否已经安装
if (!(Get-Command scoop -ErrorAction SilentlyContinue)) {
    Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
} else {
    Write-Host "Scoop已安装，跳过安装步骤"
}

Write-Host "`n5. 安装ngrok..."
# 检查ngrok是否已经安装
try {
    scoop list ngrok | Out-Null
    Write-Host "ngrok已安装，跳过安装步骤"
} catch {
    scoop install ngrok
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "安装完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "现在您可以："
Write-Host "1. 重启命令提示符以确保环境变量生效"
Write-Host "2. 运行: ngrok http 3000"
Write-Host ""
Write-Host "如果ngrok命令不可用，请将以下路径添加到系统PATH:"
Write-Host $shimsPath
Write-Host ""

Pause