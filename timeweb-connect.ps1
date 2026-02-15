# Подключение к Timeweb Cloud (настройка CLI twc по токену из .env)
# Запуск: .\timeweb-connect.ps1
# Требуется: pip install twc-cli (один раз)

$ErrorActionPreference = "Stop"
$envFile = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "Файл .env не найден. Создайте его из .env.example и укажите TWC_API_TOKEN=ваш_токен" -ForegroundColor Red
    exit 1
}
$content = Get-Content $envFile -Raw
if ($content -match "TWC_API_TOKEN=(.+)") {
    $token = $matches[1].Trim()
    if ([string]::IsNullOrWhiteSpace($token)) {
        Write-Host "В .env задан пустой TWC_API_TOKEN. Укажите токен из панели Timeweb Cloud (API и Terraform)." -ForegroundColor Red
        exit 1
    }
    Write-Host "Настройка twc (Timeweb Cloud CLI)..." -ForegroundColor Cyan
    $token | twc config 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Готово. Команда twc настроена. Проверка: twc --help" -ForegroundColor Green
    } else {
        Write-Host "Установите twc: pip install twc-cli" -ForegroundColor Yellow
        Write-Host "Токен для ручного ввода: twc config" -ForegroundColor Yellow
    }
} else {
    Write-Host "В .env не найден TWC_API_TOKEN=..." -ForegroundColor Red
    exit 1
}
