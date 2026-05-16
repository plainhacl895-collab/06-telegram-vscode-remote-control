# 设置安装路径
$SCOOP_PATH = 'D:\软件\Scoop'
$SOFTWARE_PATH = 'D:\软件'

# 创建目录
New-Item -ItemType Directory -Path $SOFTWARE_PATH -Force
New-Item -ItemType Directory -Path $SCOOP_PATH -Force

# 设置环境变量
$env:SCOOP = $SCOOP_PATH
[System.Environment]::SetEnvironmentVariable('SCOOP', $SCOOP_PATH, 'User')
[System.Environment]::SetEnvironmentVariable('SCOOP_GLOBAL', "$SCOOP_PATH\global", 'User')

# 将Scoop shims添加到当前会话的PATH
$SHIMS_PATH = "$SCOOP_PATH\shims"
$env:PATH = "$env:PATH;$SHIMS_PATH"

# 设置PowerShell执行策略
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

# 检查并安装Scoop
if (!(Get-Command scoop -ErrorAction SilentlyContinue)) {
    Write-Host '正在安装Scoop...'
    Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
} else {
    Write-Host 'Scoop已安装'
}

# 检查并安装ngrok
try {
    scoop list ngrok | Out-Null
    Write-Host 'ngrok已安装'
} catch {
    Write-Host '正在安装ngrok...'
    scoop install ngrok
}

Write-Host '安装完成！'
Write-Host 'ngrok已安装到D盘。'
Write-Host ''
Write-Host '现在您可以：'
Write-Host '1. 重启命令提示符以确保环境变量生效'
Write-Host '2. 运行: ngrok http 3000'