# MIbisnes — один скрипт для пуша в GitHub (минимум действий с вашей стороны)
# Запуск: правый клик → "Выполнить с помощью PowerShell" или: .\push-to-github.ps1
# При первом запуске один раз введите логин GitHub и токен (пароль) — дальше будет автоматически.

$ErrorActionPreference = "Stop"
$repoUrl = "https://github.com/wrapzone722-commits/MIBisnes.git"
$workDir = "C:\MIBisnes_push"

$sourceDir = $PSScriptRoot
if (-not $sourceDir) { $sourceDir = (Get-Location).Path }

# Токен из файла .github-token (файл в .gitignore, в репозиторий не попадёт)
$tokenFile = Join-Path $sourceDir ".github-token"
$token = $null
if (Test-Path $tokenFile) { $token = (Get-Content $tokenFile -Raw).Trim() }
$repoUrlAuth = if ($token) { "https://wrapzone722-commits:$token@github.com/wrapzone722-commits/MIBisnes.git" } else { $repoUrl }

Write-Host "MIbisnes: пуш в GitHub..." -ForegroundColor Cyan

if (Test-Path $workDir) { Remove-Item $workDir -Recurse -Force }

# Пробуем клонировать (если репо уже есть)
$cloneOk = $false
try {
    git clone $repoUrlAuth $workDir 2>&1 | Out-Null
    $cloneOk = $true
} catch { }

if ($cloneOk) {
    # Репо уже есть — копируем поверх текущие файлы и пушим
    $exclude = @("node_modules", ".git", ".github-token")
    Get-ChildItem $sourceDir -Force | Where-Object { $_.Name -notin $exclude } | ForEach-Object {
        Copy-Item $_.FullName -Destination $workDir -Recurse -Force
    }
    $nm = Join-Path $workDir "node_modules"
    if (Test-Path $nm) { Remove-Item $nm -Recurse -Force }
    Set-Location $workDir
    git add .
    git config user.email "wrapzone722-commits@users.noreply.github.com"
    git config user.name "wrapzone722-commits"
    $hasChanges = git status --porcelain
    if ($hasChanges) {
        git commit -m "MIbisnes: обновление"
        Write-Host "Пуш изменений..." -ForegroundColor Yellow
        if ($token) { git remote set-url origin $repoUrlAuth }
        git push
        if ($token) { git remote set-url origin $repoUrl }
    } else {
        Write-Host "Изменений нет, пуш не нужен." -ForegroundColor Gray
    }
} else {
    # Первый раз — репо пустой: создаём коммит и пушим
    New-Item -ItemType Directory -Path $workDir | Out-Null
    $exclude = @("node_modules", ".git", ".github-token")
    Get-ChildItem $sourceDir -Force | Where-Object { $_.Name -notin $exclude } | ForEach-Object {
        Copy-Item $_.FullName -Destination $workDir -Recurse -Force
    }
    $nm = Join-Path $workDir "node_modules"
    if (Test-Path $nm) { Remove-Item $nm -Recurse -Force }
    Set-Location $workDir
    git init
    git add .
    git config user.email "wrapzone722-commits@users.noreply.github.com"
    git config user.name "wrapzone722-commits"
    git commit -m "MIbisnes: учёт расходов детейлинг"
    git branch -M main
    git remote add origin $repoUrlAuth
    if ($token) { Write-Host "Пуш с токеном из .github-token..." -ForegroundColor Yellow }
    else { Write-Host "Введите логин и токен, если спросит." -ForegroundColor Yellow }
    git push -u origin main
    if ($token) { Set-Location $workDir; git remote set-url origin $repoUrl; Set-Location $sourceDir }
}

Set-Location $sourceDir
Write-Host "Готово: https://github.com/wrapzone722-commits/MIBisnes" -ForegroundColor Green
